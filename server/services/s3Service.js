import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import stream from 'stream';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';

const pipeline = promisify(stream.pipeline);

export const AWS_REGION = process.env.AWS_REGION || 'ap-northeast-1';
export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'revit-estimate-bucket-yuma';
export const CSV_PREFIX = 'estimates/';

const s3Client = new S3Client({ region: AWS_REGION });

export async function listS3CsvFiles() {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: CSV_PREFIX,
    });

    const response = await s3Client.send(command);
    if (!response.Contents) return [];

    return response.Contents
        .filter(obj => obj.Key.toLowerCase().endsWith('.csv'))
        .map(obj => ({
            key: obj.Key,
            filename: path.basename(obj.Key),
            size: obj.Size,
            lastModified: obj.LastModified
        }));
}

export async function getS3ObjectBuffer(key) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });
    const response = await s3Client.send(command);
    const chunks = [];
    for await (const chunk of response.Body) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

export async function searchS3Files(prefix) {
    let continuationToken = undefined;
    const allFiles = [];

    do {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: prefix,
            ContinuationToken: continuationToken
        });
        const response = await s3Client.send(command);
        if (response.Contents) {
            for (const obj of response.Contents) {
                if (obj.Size > 0) { // skip directories
                    allFiles.push({
                        key: obj.Key,
                        name: path.basename(obj.Key),
                        ext: path.extname(obj.Key).toLowerCase()
                    });
                }
            }
        }
        continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return allFiles;
}

export async function downloadS3Object(key, destPath) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });
    const response = await s3Client.send(command);
    await fs.ensureDir(path.dirname(destPath));
    await pipeline(response.Body, fs.createWriteStream(destPath));
    return destPath;
}
