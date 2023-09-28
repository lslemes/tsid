/* eslint-disable @typescript-eslint/no-explicit-any */
import { TsidGenerator } from "./tsid";

describe("generate", () => {
	it.todo("should throw when id size in bits is not a multiple of 8");
	it.todo(
		"should throw when id size in bits is not the sum of time component size and random component size in bits",
	);
	it.todo("should return an id");
	test.each([
		[48, 40, 8, 1e1],
		[48, 40, 8, 1e2],
		[48, 40, 8, 1e3],
	])(
		"collision chance when simultaneously generating ids",
		(idSizeInBits, timeComponentSizeInBits, randomComponentSizeInBits, simultaneousGenerations) => {
			const HOURS_PER_YEAR = 365.25 * 24;
			const MINUTES_PER_YEAR = HOURS_PER_YEAR * 60;
			const SECONDS_PER_YEAR = MINUTES_PER_YEAR * 60;
			const MILISECONDS_PER_YEAR = SECONDS_PER_YEAR * 1000;
			const MOCKED_TIME_COMPONENT = Date.now() - new Date("2020-01-01").getTime();
			const TEST_REDUNDANCY = 1000;

			const maxAmountOfIdDigits = Math.ceil(Math.log10(Math.pow(2, idSizeInBits)));

			const periodSupportedByTimeComponentInYearsWithMilisecondPrecision =
				Math.pow(2, timeComponentSizeInBits) / MILISECONDS_PER_YEAR;
			const periodSupportedByTimeComponentInYearsWithSecondPrecision =
				Math.pow(2, timeComponentSizeInBits) / SECONDS_PER_YEAR;
			const periodSupportedByTimeComponentInYearsWithMinutePrecision =
				Math.pow(2, timeComponentSizeInBits) / MINUTES_PER_YEAR;
			const periodSupportedByTimeComponentInYearsWithHourPrecision =
				Math.pow(2, timeComponentSizeInBits) / HOURS_PER_YEAR;

			function approximateCollisionChance(n: number, d: number): number {
				return 1 - Math.exp(-((n * (n - 1)) / (2 * d)));
			}
			const collisionChance = approximateCollisionChance(
				simultaneousGenerations,
				Math.pow(2, randomComponentSizeInBits),
			);

			const generator = new TsidGenerator(idSizeInBits, timeComponentSizeInBits, randomComponentSizeInBits);
			const getTimestampSpy = jest.spyOn(generator as any, "getTimestamp").mockReturnValue(MOCKED_TIME_COMPONENT);
			let collisions = 0;
			for (let i = 0; i < TEST_REDUNDANCY; i++) {
				const idSet = new Set<string>();
				for (let j = 0; j < simultaneousGenerations; j++) {
					const id = generator.generate();
					idSet.add(id);
				}
				collisions += simultaneousGenerations - idSet.size;
			}
			getTimestampSpy.mockRestore();

			console.log(
				`generating ${simultaneousGenerations} ids (${idSizeInBits} bits = ${timeComponentSizeInBits} time bits + ${randomComponentSizeInBits} random bits)\nmax amount of id digits: ${maxAmountOfIdDigits}\n\nperiod supported by time component with milisecond precision: ${periodSupportedByTimeComponentInYearsWithMilisecondPrecision.toFixed(
					0,
				)} years\nperiod supported by time component with second precision: ${periodSupportedByTimeComponentInYearsWithSecondPrecision.toFixed(
					0,
				)} years\nperiod supported by time component with minute precision: ${periodSupportedByTimeComponentInYearsWithMinutePrecision.toFixed(
					0,
				)} years\nperiod supported by time component with hour precision: ${periodSupportedByTimeComponentInYearsWithHourPrecision.toFixed(
					0,
				)} years\n\nchance of at least one collision happening: ${(collisionChance * 100).toFixed(
					4,
				)}%\naverage amount of collisions: ${(collisions / TEST_REDUNDANCY).toFixed(1)}`,
			);
		},
	);
	test.todo("assert order");
});

describe("getTimeComponent", () => {
	it.todo("should return the miliseconds between a provided epoch and now");
	it.todo("should throw when epoch is bigger than now");
});
describe("getRandomComponent", () => {
	it.todo("should return a value based on input bytes");
});
describe("composeId", () => {
	it.todo("should return an id");
});
describe("getRandomComponentMask", () => {
	it.todo("should return a mask for the random component");
});
