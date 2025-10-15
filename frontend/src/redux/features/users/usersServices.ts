import axios from "axios";
import * as protobuf from "protobufjs";

const API_URL = "http://localhost:3000/users";

export interface UserData {
  email: string;
  role: string;
  status: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  signature: string;
}

// ✅ Register user
const register = async (userData: UserData): Promise<UserResponse> => {
  const response = await axios.post<UserResponse>(API_URL, userData);
  return response.data;
};

// ✅ Fetch public key
const getPublicKey = async (): Promise<string> => {
  const response = await axios.get(`${API_URL}/public-key`, {
    responseType: "text",
  });
  return response.data;
};

// ✅ Decode and verify users (Protobuf)
const getAllUsersProtobuf = async (): Promise<UserResponse[]> => {
  const response = await axios.get(`${API_URL}/export`, {
    responseType: "arraybuffer",
  });

  const root = await protobuf.load("/user.proto");
  const UserList = root.lookupType("user.UserList");
  const decoded = UserList.decode(new Uint8Array(response.data));
  const users = (decoded as any).users as UserResponse[];

  const publicKeyPem = await getPublicKey();
  const crypto = window.crypto.subtle;
  const validUsers: UserResponse[] = [];

  const importKey = async (pem: string) => {
    const der = pemToDer(pem);
    const binaryDer = str2ab(der);
    return await crypto.importKey(
      "spki",
      binaryDer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-384" },
      false,
      ["verify"]
    );
  };

  const publicKey = await importKey(publicKeyPem);

  for (const user of users) {
    const emailHash = await digestSHA384(user.email);
    const signature = hexToArrayBuffer(user.signature);

    const isValid = await crypto.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      signature,
      new TextEncoder().encode(emailHash)
    );

    if (isValid) validUsers.push(user);
  }

  return validUsers;
};

// 🔹 Helpers
function digestSHA384(message: string): Promise<string> {
  return window.crypto.subtle
    .digest("SHA-384", new TextEncoder().encode(message))
    .then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    });
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  return bytes.buffer;
}

function pemToDer(pem: string): string {
  return pem
    .replace(/-----BEGIN (RSA )?PUBLIC KEY-----/, "")
    .replace(/-----END (RSA )?PUBLIC KEY-----/, "")
    .replace(/\r?\n|\r/g, "")
    .trim();
}

function str2ab(str: string): ArrayBuffer {
  const binary = window.atob(str);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}


// ✅ Fetch Single User
const getSingleUser = async (userId: number): Promise<UserResponse> => {
  const response = await axios.get<UserResponse>(`${API_URL}/${userId}`);
  return response.data;
};

// ✅ Update User
const updateUser = async (
  userId: number,
  updatedData: Partial<UserData>
): Promise<{ data: UserResponse; message: string }> => {
  const response = await axios.patch(`${API_URL}/${userId}`, updatedData);
  return response.data;
};


// ✅ Delete User
const deleteUser = async (userId: number): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_URL}/${userId}`);
  return response.data;
};

// ✅ Fetch weekly user stats
const getWeeklyUserStats = async (): Promise<
  { day: string; count: number }[]
> => {
  const response = await axios.get(`${API_URL}/stats/weekly`);
  return response.data.stats;
};

export default { register, getAllUsersProtobuf ,getSingleUser,updateUser,deleteUser,getWeeklyUserStats};
