import * as AWS from 'aws-sdk'
import { S3 } from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('FileAccess')


export class FileAccess {
    
    constructor(
        private readonly s3: S3 = createS3Client(),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
    }

    async getUploadUrl(todoId: string): Promise<string> {
        logger.info(`creating upload url for todo ${todoId} on bucket ${this.bucketName} with expiration ${this.urlExpiration}`)
        const url =this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: parseInt(this.urlExpiration)
        })
        logger.info(`upload url for ${todoId} on bucket ${this.bucketName} with expiration ${this.urlExpiration} is: ${url}`)
        return url;
    }

    getAttachmentUrl(todoId: string): string {
        logger.info(`get attachment url for todo ${todoId} on bucket ${this.bucketName}`)
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;
    }
}


function createS3Client() : S3 {
    const XAWS = AWSXRay.captureAWS(AWS)
    const s3 = new XAWS.S3({
        signatureVersion: 'v4'
    });
    return s3;
}