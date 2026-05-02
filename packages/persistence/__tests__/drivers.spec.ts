import { LocalStorageDriver } from "../src/drivers/LocalStorageDriver";

describe("storage drivers", () => {
	describe("local storage driver", () => {
		let driver: LocalStorageDriver;
		beforeEach(() => {
			driver = LocalStorageDriver.createInstance("test");
		});
		afterEach(async () => {
			await driver.clear();
		});
		describe("prepare", () => {
			it("should resolve without errors", async () => {
				await expect(driver.prepare()).resolves.not.toThrow();
			});
		});
		describe("supports", () => {
			it("should return true if supported", async () => {
				await expect(driver.supports()).resolves.toBe(true);
			});
		});
		describe("getItem", () => {
			it("should return a Blob if the key exists", async () => {
				const mockBlob = new Blob(["test"], { type: "text/plain" });
				await driver.setItem("testKey", mockBlob);
				const getItemPromise = driver.getItem("testKey");
				await expect(getItemPromise).resolves.toStrictEqual(mockBlob);
			});

			it("should return undefined if the key does not exist", async () => {
				const getItemPromise = driver.getItem("nonExistentKey");
				await expect(getItemPromise).resolves.toBeUndefined();
			});
		});

		describe("removeItem", () => {
			it("should remove the item with the given key", async () => {
				const removeItemPromise = driver.removeItem("testKey");
				await expect(removeItemPromise).resolves.not.toThrow();
			});
		});

		describe("setItem", () => {
			it("should set the item with the given key and value", async () => {
				const mockBlob = new Blob(["test"], { type: "text/plain" });
				const setItem = driver.setItem("testKey", mockBlob);
				await expect(setItem).resolves.not.toThrow();
			});
		});
		describe("clear", () => {
			it("should clear all items", async () => {
				const mockBlob = new Blob(["test"], { type: "text/plain" });
				const mockKey = "testKey";
				await driver.setItem(mockKey, mockBlob);
				await expect(driver.clear()).resolves.not.toThrow();
				await expect(driver.getItem(mockKey)).resolves.toBeUndefined();
				await expect(driver.length()).resolves.toBe(0);
			});
		});

		describe("observe", () => {
			let originGetItem: LocalStorageDriver["getItem"];
			beforeEach(() => {
				originGetItem = driver.getItem;
				driver.getItem = jest.fn();
			});
			afterEach(() => {
				driver.getItem = originGetItem;
			});
			it("should getItem not be called when no listeners are added", async () => {
				await driver.setItem(
					"testKey",
					new Blob(["test"], { type: "text/plain" }),
				);
				expect(driver.getItem).not.toHaveBeenCalled();
			});
			it("should call the getItem and onChange listener when the item changes", async () => {
				const mockKey = "testKey";
				const mockOnChange = jest.fn();
				const unobserve = driver.observe(mockKey, mockOnChange);
				await driver.setItem(
					mockKey,
					new Blob(["test"], { type: "text/plain" }),
				);
				unobserve();
				expect(mockOnChange).toHaveBeenCalled();
			});
		});
	});
	describe("indexedDB storage driver", () => {
		//
	});
});
