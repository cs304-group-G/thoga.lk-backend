const generateFileName = (productId) => {
  const timeNow = new Date();
  const filename = productId + timeNow.toUTCString();
  return filename;
};

export default { generateFileName };
