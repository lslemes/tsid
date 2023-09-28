import { randomBytes } from "crypto";

export class TsidGenerator {
	private readonly idSizeInBits: number;
	private readonly timeComponentSizeInBits: number;
	private readonly randomComponentSizeInBits: number;
	private readonly epoch: Date;

	constructor(
		idSizeInBits: number = 64,
		timeComponentSizeInBits: number = 42,
		randomComponentSizeInBits: number = 22,
		epoch: Date = new Date("2020-01-01"),
	) {
		if (idSizeInBits % 8 !== 0) throw new Error(`idSizeInBits(${idSizeInBits}) must be a multiple of 8`);
		if (idSizeInBits !== timeComponentSizeInBits + randomComponentSizeInBits)
			throw new Error(
				`idSizeInBits(${idSizeInBits}) must be the sum of timeComponentSizeInBits(${timeComponentSizeInBits}) and randomComponentSizeInBits(${randomComponentSizeInBits})`,
			);
		const now = new Date();
		if (epoch > now) throw new Error(`epoch(${epoch}) must be earlier than now(${now})`);
		this.idSizeInBits = idSizeInBits;
		this.timeComponentSizeInBits = timeComponentSizeInBits;
		this.randomComponentSizeInBits = randomComponentSizeInBits;
		this.epoch = epoch;
	}

	generate(): string {
		const bytes = randomBytes(this.idSizeInBits / 8);
		// TsidGenerator.prettyPrintBytes(bytes);
		const timestamp = this.getTimestamp();
		// console.log(`timestamp: ${timestamp} miliseconds since ${this.epoch}\n`);
		const randomValue = this.getRandomValueFromBytes(bytes);
		const id = this.composeId(timestamp, randomValue);
		// console.log("id :>> ", id);

		return id.toString();
	}

	private getTimestamp(): number {
		return Date.now() - this.epoch.getTime();
	}

	private getRandomValueFromBytes(bytes: Buffer): bigint {
		let value = BigInt(0);
		for (let i = 0; i < bytes.length; i++) {
			const shiftedByteValue = BigInt(bytes[i]) << BigInt(bytes.length * 8 - 8 * (i + 1));
			// console.log(this.getPrettyBinaryString(value));
			// console.log(this.getPrettyBinaryString(shiftedByteValue));
			// console.log(`${this.getPrettyResultLine()} OR`);
			value |= shiftedByteValue;
			// console.log(this.getPrettyBinaryString(value));
			// console.log();
		}
		return value;
	}

	private composeId(timestamp: number, randomValue: bigint): bigint {
		const timeComponentMask = this.getTimeComponentMask();
		const randomComponentMask = this.getRandomComponentMask();

		// console.log("timeComponentMask :>>\t", this.getPrettyBinaryString(timeComponentMask));
		// console.log("randomComponentMask :>>\t", this.getPrettyBinaryString(randomComponentMask));
		// console.log();

		const timeComponent = BigInt(BigInt(timestamp) << BigInt(this.randomComponentSizeInBits)) & timeComponentMask;
		const randomComponent = randomValue & randomComponentMask;

		const id = timeComponent | randomComponent;

		// console.log("timeComponent");
		// console.log(timestamp.toString(2));
		// console.log("<<", this.randomComponentSizeInBits);
		// const shiftedTimestampBinaryString = (BigInt(timestamp) << BigInt(this.randomComponentSizeInBits)).toString(2);
		// console.log(
		// 	shiftedTimestampBinaryString.padStart(
		// 		Math.max(shiftedTimestampBinaryString.length, this.idSizeInBits),
		// 		"0",
		// 	),
		// );
		// console.log(
		// 	timeComponentMask
		// 		.toString(2)
		// 		.padStart(Math.max(shiftedTimestampBinaryString.length, this.idSizeInBits), "0"),
		// );
		// console.log(`AND`);
		// console.log(
		// 	timeComponent.toString(2).padStart(Math.max(shiftedTimestampBinaryString.length, this.idSizeInBits), "0"),
		// );
		// console.log(this.getPrettyResultLine());
		// console.log(`${this.getPrettyBinaryString(timeComponent)}\n`);

		// console.log("randomComponent");
		// console.log(this.getPrettyBinaryString(randomValue));
		// console.log(this.getPrettyBinaryString(randomComponentMask));
		// console.log(`${this.getPrettyResultLine()} AND`);
		// console.log(`${this.getPrettyBinaryString(randomComponent)}\n`);

		// console.log("id");
		// console.log(this.getPrettyBinaryString(timeComponent));
		// console.log(this.getPrettyBinaryString(randomComponent));
		// console.log(`${this.getPrettyResultLine()} OR`);
		// console.log(`${this.getPrettyBinaryString(id)}\n`);

		return id;
	}

	private getTimeComponentMask(): bigint {
		const mask =
			BigInt(BigInt(2) ** BigInt(this.timeComponentSizeInBits) - BigInt(1)) <<
			BigInt(this.randomComponentSizeInBits);
		return mask;
	}

	private getRandomComponentMask(): bigint {
		const mask = ~BigInt(~BigInt(0) << BigInt(this.randomComponentSizeInBits));
		return mask;
	}

	// private static prettyPrintBytes(bytes: Buffer): void {
	// 	console.log("bytes :>> ", bytes);
	// 	for (let i = 0; i < bytes.length; i++) {
	// 		console.log(
	// 			`bytes[${i}]: ${bytes[i].toString(16).padStart(2, "0")} = ${bytes[i]
	// 				.toString()
	// 				.padStart(3, "0")} = ${bytes[i].toString(2).padStart(8, "0")}`,
	// 		);
	// 	}
	// 	console.log();
	// }

	// private getPrettyBinaryString(value: bigint): string {
	// 	return `${value
	// 		.toString(2)
	// 		.padStart(this.idSizeInBits, "0")
	// 		.match(/.{1,8}/g)
	// 		?.join(" ")}`;
	// }

	// private getPrettyResultLine(): string {
	// 	let line = "";
	// 	for (let i = 0; i < this.idSizeInBits + (this.idSizeInBits / 8 - 1); i++) {
	// 		line += "-";
	// 	}
	// 	return line;
	// }
}
