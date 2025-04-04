import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const getUploadPath = (uploadPath: string): string => {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    return uploadPath;
};

const createMulterStorage = (uploadPath: string): StorageEngine => {
    return multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb) => {
            cb(null, getUploadPath(uploadPath));
        },
        filename: (req: Request, file: Express.Multer.File, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });
};

const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'));
    }
};

const pdfFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'));
    }
};

const csvFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed!'));
    }
};


const fileUpload = (uploadPath: string) => {
    return multer({
        storage: createMulterStorage(uploadPath),
        fileFilter: pdfFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    });
};


const onlyImageUpload = (uploadPath: string) => {
    console.log("uploadPath", uploadPath)
    return multer({
        storage: createMulterStorage(uploadPath),
        fileFilter: imageFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    })
}



const deleteFile = (filePath: string) => {
    if (!filePath) return;

    const normalizedPath = path.resolve(filePath);
    fs.unlink(normalizedPath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
        } else {
            console.log("File deleted successfully:", filePath);
        }
    });
};



export { fileUpload, imageFilter, pdfFilter, csvFilter, onlyImageUpload, deleteFile };
