import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerOptions = {
	storage: diskStorage({
		destination: './uploads',
		filename: (req, file, cb) => {
			const uniqueSuffix = `${Date.now()}-${uuidv4()}${extname(file.originalname)}`;
			cb(null, uniqueSuffix);
		},
	}),
	fileFilter: (req, file, cb) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			return cb(new Error('Only image files are allowed!'), false);
		}
		cb(null, true);
	},
};
