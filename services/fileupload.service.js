import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase.config.js";
import generateFileName from "../utils/generateFileName.js";

const uploadFileToFirebaseStorage = async (productId, file) => {
  const fileRef = ref(storage, generateFileName(productId));

  const metadata = {
    contentType: file.mimetype,
  };

  uploadBytesResumable(fileRef, file.buffer, metadata)
    .then(async (res) => {
      const url = await getDownloadURL(fileRef);
      return url;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export default uploadFileToFirebaseStorage;
