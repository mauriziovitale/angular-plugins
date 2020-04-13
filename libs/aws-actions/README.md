# aws-actions

This library was generated with [Nx](https://nx.dev).

## Running unit tests

The plugin allow to pull an artifact from an S3 bucket.

Precondition: 
 - aws cli already installed
 - .env which contains the AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID
 
```json
"aws": {
  "builder": "@angular-custom-builders/aws-actions:pull",
  "options": {
    "bucket": "s3://myapp-builds/branch",
    "artifactName": "myapp.tar.bz2",
    "outputPath": "dist/apps/myapp"
  }
}
```
