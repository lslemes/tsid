import { randomBytes } from "crypto";

export class Tsid {
	static generate(
		idSizeInBits: number = 64,
		timeComponentSizeInBits: number = 42,
		randomComponentSizeInBits: number = 22,
		epoch: Date = new Date("2020-01-01"),
	): bigint {
		if (idSizeInBits % 8 !== 0) throw new Error("idSizeInBits must be a multiple of 8");
		if (idSizeInBits !== timeComponentSizeInBits + randomComponentSizeInBits)
			throw new Error("idSizeInBits must be the sum of timeComponentSizeInBits and randomComponentSizeInBits");

		const bytes = randomBytes(idSizeInBits / 8);
		const timeComponent = Tsid.getTimeComponent(epoch);
		const randomComponent = Tsid.getRandomComponent(bytes);
		const id = this.composeId(randomComponentSizeInBits, timeComponent, randomComponent);

		return id;
	}

	private static getTimeComponent(epoch: Date): number {
		return Date.now() - epoch.getTime();
	}

	private static getRandomComponent(bytes: Buffer): bigint {
		let value = BigInt(0);
		for (let i = 0; i < bytes.length; i++) {
			value |= BigInt(bytes[i]) << BigInt(bytes.length * bytes.byteLength - bytes.byteLength * (i + 1));
		}
		return value;
	}

	private static composeId(
		randomComponentSizeInBits: number,
		timeComponent: number,
		randomComponent: bigint,
	): bigint {
		const randomComponentMask = Tsid.getRandomComponentMask(randomComponentSizeInBits);
		const id =
			(BigInt(timeComponent) << BigInt(randomComponentSizeInBits)) | (randomComponent & randomComponentMask);
		return id;
	}

	private static getRandomComponentMask(randomComponentSizeInBits: number): bigint {
		const mask = ~BigInt(~BigInt(0) << BigInt(randomComponentSizeInBits));
		return mask;
	}
}
