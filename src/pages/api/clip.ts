
// /src/pages/api/clip.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import ytdl from 'yt-dlp-exec';
import ffmpeg from 'fluent-ffmpeg';
import { formidable } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({ 
    maxFileSize: 10 * 1024 * 1024, // 10MB
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    const ffmpegStatic = require('ffmpeg-static');
    ffmpeg.setFfmpegPath(ffmpegStatic!);

    const { fields, files } = await parseForm(req);
    
    const videoUrl = Array.isArray(fields.videoUrl) ? fields.videoUrl[0] : fields.videoUrl;
    const startTime = Number(Array.isArray(fields.startTime) ? fields.startTime[0] : fields.startTime);
    const endTime = Number(Array.isArray(fields.endTime) ? fields.endTime[0] : fields.endTime);
    const numberOfClips = parseInt(Array.isArray(fields.numberOfClips) ? fields.numberOfClips[0] : fields.numberOfClips || '1', 10);
    const credits = Array.isArray(fields.credits) ? fields.credits[0] : fields.credits;
    
    const logoFile = files.logo ? (Array.isArray(files.logo) ? files.logo[0] : files.logo) : null;
    const logoPath = logoFile?.filepath;


    if (!videoUrl) {
      return res.status(400).json({ error: 'Missing videoUrl' });
    }
    
    const tempDir = path.join(os.tmpdir(), uuidv4());
    await fs.promises.mkdir(tempDir, { recursive: true });

    const sourceVideoPath = path.join(tempDir, 'source.mp4');

    await ytdl(videoUrl, {
      format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
      output: sourceVideoPath,
    });
    
    const clipDuration = (endTime - startTime) / numberOfClips;
    const clipPaths: string[] = [];
    const processingPromises: Promise<void>[] = [];

    for (let i = 0; i < numberOfClips; i++) {
        const clipStartTime = startTime + (i * clipDuration);
        const outputClipPath = path.join(tempDir, `clip_${i + 1}.mp4`);

        const processClip = new Promise<void>((resolve, reject) => {
            const command = ffmpeg(sourceVideoPath)
                .setStartTime(clipStartTime)
                .setDuration(clipDuration)
                .outputOptions('-c:v libx264')
                .outputOptions('-preset slow')
                .outputOptions('-crf 22')
                .outputOptions('-c:a aac')
                .outputOptions('-b:a 128k');
            
            const videoFilters: string[] = [];
            
            if (logoPath) {
                 command.input(logoPath);
                 videoFilters.push(`[0:v][1:v]overlay=W-w-10:10`);
            }

            if (credits) {
                 const currentVideoInput = videoFilters.length > 0 ? `[vid_out]` : '[0:v]';
                 let filterString = `${currentVideoInput}drawtext=text='${credits.replace(/'/g, `''`)}':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=h-th-10`;

                 if(videoFilters.length > 0) {
                    // chain the filters
                    videoFilters[videoFilters.length - 1] += `[tmp]; [tmp]${filterString.substring(currentVideoInput.length)}`;
                 } else {
                    videoFilters.push(filterString);
                 }
            }
            
            if(videoFilters.length > 0) {
                // If there's only one filter and it doesn't have an output sink, add one.
                const lastFilter = videoFilters[videoFilters.length - 1];
                if (!lastFilter.match(/\[[^\]]+\]$/)) {
                    videoFilters[videoFilters.length - 1] = lastFilter + '[vid_out]';
                }
                command.complexFilter(videoFilters.join(';'), videoFilters.length > 1 ? 'vid_out' : 'vid_out');
            }

            command
                .on('end', () => {
                    clipPaths[i] = outputClipPath;
                    resolve();
                })
                .on('error', (err) => {
                    console.error('ffmpeg error:', err);
                    reject(new Error(`Error processing clip ${i + 1}: ${err.message}`));
                })
                .save(outputClipPath);
        });
        processingPromises.push(processClip);
    }
    
    await Promise.all(processingPromises);

    const clipDataUris = await Promise.all(
        clipPaths.map(async (p) => {
            if(!p) return '';
            const data = await fs.promises.readFile(p);
            return `data:video/mp4;base64,${data.toString('base64')}`;
        })
    );
    
    res.status(200).json({ clips: clipDataUris.filter(Boolean) });

    // Cleanup temp files
    fs.promises.rm(tempDir, { recursive: true, force: true }).catch(console.error);
    if(logoPath) {
        fs.promises.rm(logoPath, {force: true}).catch(console.error);
    }

  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate clips' });
  }
}
