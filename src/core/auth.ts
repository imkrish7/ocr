import * as jose from "jose";
import type { JWTPayload } from "../types/auth.ts";
import { createSecretKey } from "crypto";

const getSecret = async () => {
	const secret = await createSecretKey(
		process.env.AUTH_SECRET || "krishna",
		"utf-8"
	);
	return secret;
};

export const signPayload = async (payload: JWTPayload) => {
	const secret = await getSecret();
	const accessToken = await new jose.SignJWT({
		"urn:ocr:claim": true,
		...payload,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setIssuer("urn:ocr:issuer")
		.setAudience("urn:ocr:audience")
		.setExpirationTime("2h")
		.sign(secret);

	const refreshToken = await new jose.SignJWT({
		"urn:ocr:claim": true,
		...payload,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setIssuer("urn:ocr:issuer")
		.setAudience("urn:ocr:audience")
		.setExpirationTime("24h")
		.sign(secret);
	return { accessToken, refreshToken };
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
