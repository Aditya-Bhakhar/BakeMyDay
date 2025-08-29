const extractPublicId = (secureUrl) => {
  // Remove everything before /upload/
  const parts = secureUrl.split("/upload/");
  if (parts.length < 2) return null;

  // Take the right side: v1756213628/BakeMyDay/Product Images/wnmkvnsuslvjwjl4n6nl.webp
  let publicIdWithVersion = parts[1];

  // Remove the version prefix (starts with v12345/)
  publicIdWithVersion = publicIdWithVersion.replace(/^v\d+\//, "");

  // Remove file extension (.jpg, .png, .webp, etc.)
  let publicId = publicIdWithVersion.substring(
    0,
    publicIdWithVersion.lastIndexOf(".")
  );

  // Decode %20 etc. → turns "Product%20Images" into "Product Images"
  publicId = decodeURIComponent(publicId);

  return publicId;
};

export { extractPublicId };
