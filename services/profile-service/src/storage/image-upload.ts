import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from "@nestjs/common";

const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const imageValidationPipe = () =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_BYTES }),
      new FileTypeValidator({ fileType: /^image\// }),
    ],
  });
