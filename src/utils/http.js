import {HTTP_PROTOCOL, SERVER_IP, SERVER_PORT} from "./constraints";

export async function login(data) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function getAllTests(token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/tests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function getTestById(id, token = null) {
  let response;
  if (token === null) {
    response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/tests/${id}`);
  } else {
    response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/tests/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function getQuestionsByTestId(id, token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/tests/${id}/questions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function getSamplesByTestId(id, token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/tests/${id}/samples`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function createTest(data, token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/tests`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function getCollectionByName(name, token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/collections/${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function getQuestionsByCollectionName(name, token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/collections/${name}/questions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function createCollection(data, token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/collections`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function addQuestionToCollection(data, name, token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/collections/${name}/questions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({questions: [data]}),
  });
  console.log({questions: [data]})
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function deleteTestById(id, token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/tests/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await response.text();
  const resData = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function deleteCollectionByName(name, token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/collections/${name}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await response.text();
  const resData = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function getFinishedSessionsByTestId(id, token, credentials = '') {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/tests/${id}/finishedSessions${credentials !== '' ? `?credentials=${credentials}` : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}

export async function getFinishedSessionsByTestIdInCsv(name, id, token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/tests/${id}/finishedSessions/csv`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${name}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error('Failed to download file');
  }
}

export async function getAllCollections(token) {
  const response = await fetch(`${HTTP_PROTOCOL}${SERVER_IP}${SERVER_PORT}/api/v1/admin/collections`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message);
  }
  return resData;
}
