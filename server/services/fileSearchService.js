import fg from 'fast-glob';
import path from 'path';
import { searchS3Files } from './s3Service.js';

export async function searchFiles(targetFolder) {
    // 従来のローカル参照フォルダ前提のコードは未使用とし、S3検索への切り替えを実施
    // const normalizedFolder = targetFolder.replace(/\\/g, '/');
    // const pattern = `${normalizedFolder}/**/*.{pptx,ppt,pdf}`;
    // 
    // const files = await fg([pattern], { 
    //     absolute: true,
    //     caseSensitiveMatch: false 
    // });

    const files = await searchS3Files('refarence（仮）/');

    const fileList = files.map(file => {
        // file: { key, name, ext } from s3Service
        const ext = file.ext.toLowerCase();
        return {
            path: file.key, // Now path is the S3 key, used later in copy/download process
            name: file.name,
            ext: ext, // .pptx, .ppt, .pdf
            type: ext === '.pdf' ? 'pdf' : 'ppt',
        };
    });

    return fileList;
}
