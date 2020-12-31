const API_URL = process.env.REACT_APP_API_URL

export const callApiAuth = async (path: string, method: string,
  body: any) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "content-type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(body)
  })
  const data = await response.json();

  return data;
}

export const callApiGet = async (path: string, method: string,
  token: string) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    // credentials: "include",
  })
  const data = await response.json();

  return data;
}

export const callApiPost = async (
  path: string, method: string,
  body: any, token: string) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json"
    },
    // credentials: "include",
    body: JSON.stringify(body)
  })
  const data = await response.json();

  return data;
}
