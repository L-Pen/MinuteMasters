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

export const updateGoogleDoc = async (
  documentId: string,
  token: string,
  content: any
): Promise<any> => {
  console.log("token", {
    token,
    content,
    documentId,
  });
  const response = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(content),
    }
  );

  console.log("response", response, response.body);

  if (!response.ok) {
    throw new Error(`Failed to update document: ${response.status}`);
  }

  // const data = await response.json();
  const data = await response.json();
  return data;
};
