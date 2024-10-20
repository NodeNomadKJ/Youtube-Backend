import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import ApiError from "./apiError.js";

class FileDeletionUtil {
  static async deleteLocalFile(localFilePath) {
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log(`Local file deleted: ${localFilePath}`);
      } else {
        console.log(`Local file not found: ${localFilePath}`);
      }
    } catch (error) {
      // Log the error for debugging
      console.error(`Error deleting local file: ${localFilePath}`, error);
    }
  }

  static async deleteCloudinaryFile(cloudinaryUrl) {
    try {
      const publicId = this.extractPublicIdFromUrl(cloudinaryUrl);

      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === "ok") {
          console.log(`Cloudinary file deleted: ${cloudinaryUrl}`);
        } else {
          throw new ApiError(
            500,
            `Failed to delete Cloudinary file: ${cloudinaryUrl}`
          );
        }
      } else {
        console.log(`Invalid Cloudinary URL: ${cloudinaryUrl}`);
      }
    } catch (error) {
      throw new ApiError(
        500,
        `Error deleting Cloudinary file: ${cloudinaryUrl}`,
        error
      );
    }
  }

  static extractPublicIdFromUrl(cloudinaryUrl) {
    const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
    const match = cloudinaryUrl.match(regex);
    return match ? match[1] : null;
  }
}

export default FileDeletionUtil;
