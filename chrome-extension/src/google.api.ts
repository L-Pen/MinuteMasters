export const getGoogleDoc = async (
  sheetId: string,
  token: string
): Promise<any> => {
  const response = await fetch(
    `https://docs.googleapis.com/v1/documents/${sheetId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
};
