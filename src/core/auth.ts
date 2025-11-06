import * as jose from "jose";
import type { JWTPayload } from "../types/auth.ts";

const getSecret = async () => {
	const secret = await jose.generateSecret("HS256", { extractable: true });
	return secret;
};

export const signPayload = async (payload: JWTPayload) => {
	const secret = await getSecret();
	const jwt = await new jose.SignJWT({ "urn:ocr:claim": true, ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setIssuer("urn:ocr:issuer")
		.setAudience("urn:ocr:audience")
		.setExpirationTime("2h")
		.sign(secret);
	return jwt;
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
	try {
		const secret = await getSecret();
		const { payload } = await jose.jwtVerify<JWTPayload>(token, secret);
		return payload;
	} catch (error) {
		throw error;
	}
};
