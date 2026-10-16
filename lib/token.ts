
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;


export class Token {

  static generate(
    payload: {id: string, username: string},
  ): string {

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  }

  static verify(token: string): JwtPayload | string {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.verify(token, JWT_SECRET);
  }

}
