/* eslint-disable @typescript-eslint/no-explicit-any */
import sinon from "sinon";
import {Repository} from "typeorm";
import * as AuthService from "../src/services/auth.service";
import { AppDataSource } from "../src/infrastructure/data-source";
import { User } from "../src/datamodels/User";
import { expect } from "chai";

describe("Auth service Unit tests:", () => {
   const sandbox = sinon.createSandbox()
   let testUser: User;
   let repositoryStub: any;
   beforeEach(() => {
    repositoryStub = sinon.createStubInstance(Repository);
    sandbox.stub(AppDataSource, "getRepository").returns(repositoryStub);
    testUser = {
        FirstName: "John",
        LastName: "Doe",
        Email: "test@mail.com",
        PasswordHash: "password",
        Address: "1234 Main St",
        PhoneNumber: "1234567890"
        }
   })

   afterEach(() => {
     sandbox.restore();
   })

    describe("register", () => {
        it("should call getRepository with User", async () => {
        repositoryStub.save.resolves({ Id: 1 }); 
        await AuthService.register(testUser);
            sinon.assert.calledWith(repositoryStub.save, testUser);
        })

        it("should throw an error if save fails", async () => {
            const errorMessage = "Save failed";
            repositoryStub.save.throws(new Error(errorMessage));
            try {
                await AuthService.register(testUser);
            } catch (error) {
                expect((error as Error).message).to.equal(errorMessage);
            }
        })
        })
    })