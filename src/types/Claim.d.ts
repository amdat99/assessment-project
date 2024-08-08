import { User } from "./User";
import { Address } from "./Address";

export interface Claim {
  id: string;
  userId: string;
  status: "active" | "complete";
  createdDate: string;
  updatedDate: string;
  creationIpAddress;
  data: Address[];
  userData: User;
}
