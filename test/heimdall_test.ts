import { expect } from "chai";
import {ethers, upgrades} from "hardhat";
import {describe} from "mocha";                                                 // eslint-disable-line
import {ContractFactory} from "ethers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {INVALID_ADMIN, INVALID_ROLE, NO_ACCESS} from "./error_messages";          // eslint-disable-line
import {keccak256, toUtf8Bytes} from "ethers/lib/utils";            // eslint-disable-line



let hdlowner: SignerWithAddress, adminuser: SignerWithAddress, owneruser: SignerWithAddress
let foouser: SignerWithAddress, baruser: SignerWithAddress, serveruser: SignerWithAddress
let Heimdall: ContractFactory, heimdall: any

// keccack256 encoded from contract
const HEIMDALL_OWNER = keccak256(toUtf8Bytes('OWNER'))
const HEIMDALL_CONTRACT = keccak256(toUtf8Bytes('CONTRACT'))
const OWNER = keccak256(toUtf8Bytes('PROJECT.OWNER'))
const SERVER = keccak256(toUtf8Bytes('PROJECT.SERVER'))
const ADMIN = keccak256(toUtf8Bytes('PROJECT.ADMIN'))

const init_contract = async () => {
    [owneruser, adminuser, foouser, baruser, hdlowner, serveruser] = await ethers.getSigners()
    
    const admins = [adminuser.address]
    // const staffs = [staffuser.address]
    
    Heimdall = await ethers.getContractFactory('Gatekeeper', hdlowner)
    heimdall = await Heimdall.deploy(owneruser.address, serveruser.address, admins)
    await heimdall.deployed()
}

describe('Heimdall the gatekeeper', () => {
    
    beforeEach(async () => {
        await init_contract()
    })
    
    // it('Test', async () => {
    //     // console.log('OWNER', await heimdall.OWNER())
    //     // console.log('PROJECT.OWNER', await heimdall.gkroles('PROJECT.OWNER'))
    //     // console.log('PROJECT.ADMIN', await heimdall.gkroles('PROJECT.ADMIN'))
    //     // console.log('PROJECT.STAFF', await heimdall.gkroles('PROJECT.STAFF'))
    //     // console.log('CONTRACT', await heimdall.gkroles('CONTRACT'))
    //     // console.log(await heimdall.getKeccak256('PROJECT.STAFF'))
    // })
    
    it('Init', async () => {
        {   // eslint-disable-line
            // Roles init
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, hdlowner.address)).is.true
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, owneruser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, adminuser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, foouser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, baruser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, serveruser.address)).is.false
            
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, hdlowner.address)).is.true
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, owneruser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, adminuser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, foouser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, baruser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, serveruser.address)).is.false
            
            expect(await heimdall.connect(foouser).hasRole(OWNER, hdlowner.address)).is.true
            expect(await heimdall.connect(foouser).hasRole(OWNER, owneruser.address)).is.true
            expect(await heimdall.connect(foouser).hasRole(OWNER, adminuser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(OWNER, foouser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(OWNER, baruser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(OWNER, serveruser.address)).is.false
            
            expect(await heimdall.connect(foouser).hasRole(ADMIN, hdlowner.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(ADMIN, owneruser.address)).is.true
            expect(await heimdall.connect(foouser).hasRole(ADMIN, adminuser.address)).is.true
            expect(await heimdall.connect(foouser).hasRole(ADMIN, foouser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(ADMIN, baruser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(ADMIN, serveruser.address)).is.false
            
            expect(await heimdall.connect(foouser).hasRole(SERVER, hdlowner.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(SERVER, owneruser.address)).is.true
            expect(await heimdall.connect(foouser).hasRole(SERVER, adminuser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(SERVER, foouser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(SERVER, baruser.address)).is.false
            expect(await heimdall.connect(foouser).hasRole(SERVER, serveruser.address)).is.true
        }
    })
    
    // it('Access', async () => {
    //     const purge_roles = async (user: SignerWithAddress, role: any = null, acct: any = owneruser) => {
    //         if(role) await heimdall.connect(acct).revokeRole(role, user.address)
    //
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, user.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, user.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(OWNER, user.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(ADMIN, user.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(STAFF, user.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(SERVER, user.address)).is.false
    //     }
    //
    //     // Role admins
    //     expect(await heimdall.getRoleAdmin(HEIMDALL_OWNER)).equals(HEIMDALL_OWNER)
    //     expect(await heimdall.getRoleAdmin(HEIMDALL_CONTRACT)).equals(HEIMDALL_OWNER)
    //     expect(await heimdall.getRoleAdmin(OWNER)).equals(HEIMDALL_OWNER)
    //     expect(await heimdall.getRoleAdmin(ADMIN)).equals(OWNER)
    //     expect(await heimdall.getRoleAdmin(STAFF)).equals(ADMIN)
    //     expect(await heimdall.getRoleAdmin(SERVER)).equals(OWNER)
    //
    //     // Granting roles
    //     for(let account of [adminuser, staffuser, foouser, baruser, serveruser]) {
    //         await expect(heimdall.connect(account).grantRole(HEIMDALL_OWNER, foouser.address)).is.revertedWith(NO_ACCESS)
    //         await expect(heimdall.connect(account).grantRole(HEIMDALL_CONTRACT, foouser.address)).is.revertedWith(NO_ACCESS)
    //         await expect(heimdall.connect(account).grantRole(OWNER, foouser.address)).is.revertedWith(NO_ACCESS)
    //         await expect(heimdall.connect(account).grantRole(ADMIN, foouser.address)).is.revertedWith(NO_ACCESS)
    //         await expect(heimdall.connect(account).grantRole(SERVER, foouser.address)).is.revertedWith(NO_ACCESS)
    //
    //         if(account.address !== adminuser.address) {
    //             await expect(heimdall.connect(account).grantRole(STAFF, foouser.address)).is.revertedWith(NO_ACCESS)
    //         }
    //
    //         if(account.address !== serveruser.address || account.address !== owneruser.address) {
    //             await expect(heimdall.connect(account).grantRole(SERVER, foouser.address)).is.revertedWith(NO_ACCESS)
    //         }
    //     }
    //     await expect(heimdall.connect(owneruser).grantRole(HEIMDALL_OWNER, foouser.address)).is.revertedWith(NO_ACCESS)
    //     await expect(heimdall.connect(owneruser).grantRole(HEIMDALL_CONTRACT, foouser.address)).is.revertedWith(NO_ACCESS)
    //
    //     // Roles
    //     {   // eslint-disable-line
    //         await purge_roles(baruser)
    //
    //         await heimdall.connect(hdlowner).grantRole(HEIMDALL_OWNER, baruser.address)
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, baruser.address)).is.true
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(OWNER, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(ADMIN, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(STAFF, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(SERVER, baruser.address)).is.false
    //         await purge_roles(baruser, HEIMDALL_OWNER, hdlowner)
    //
    //         await heimdall.connect(hdlowner).grantRole(HEIMDALL_CONTRACT, baruser.address)
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, baruser.address)).is.true
    //         expect(await heimdall.connect(foouser).hasRole(OWNER, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(ADMIN, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(STAFF, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(SERVER, baruser.address)).is.false
    //         await purge_roles(baruser, HEIMDALL_CONTRACT, hdlowner)
    //
    //         await heimdall.connect(hdlowner).grantRole(OWNER, baruser.address)
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(OWNER, baruser.address)).is.true
    //         expect(await heimdall.connect(foouser).hasRole(ADMIN, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(STAFF, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(SERVER, baruser.address)).is.false
    //         await purge_roles(baruser, OWNER, hdlowner)
    //
    //         await heimdall.connect(owneruser).grantRole(ADMIN, baruser.address)
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(OWNER, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(ADMIN, baruser.address)).is.true
    //         expect(await heimdall.connect(foouser).hasRole(STAFF, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(SERVER, baruser.address)).is.false
    //         await purge_roles(baruser, ADMIN)
    //
    //         await heimdall.connect(adminuser).grantRole(STAFF, baruser.address)
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(OWNER, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(ADMIN, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(STAFF, baruser.address)).is.true
    //         expect(await heimdall.connect(foouser).hasRole(SERVER, baruser.address)).is.false
    //         await purge_roles(baruser, STAFF)
    //
    //         await heimdall.connect(owneruser).grantRole(SERVER, baruser.address)
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(OWNER, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(ADMIN, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(STAFF, baruser.address)).is.false
    //         expect(await heimdall.connect(foouser).hasRole(SERVER, baruser.address)).is.true
    //         await purge_roles(baruser, SERVER)
    //
    //         await heimdall.connect(hdlowner).grantRole(HEIMDALL_OWNER, baruser.address)
    //         await heimdall.connect(hdlowner).grantRole(HEIMDALL_CONTRACT, baruser.address)
    //         await heimdall.connect(hdlowner).grantRole(OWNER, baruser.address)
    //         await heimdall.connect(owneruser).grantRole(ADMIN, baruser.address)
    //         await heimdall.connect(adminuser).grantRole(STAFF, baruser.address)
    //         await heimdall.connect(owneruser).grantRole(SERVER, baruser.address)
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_OWNER, baruser.address)).is.true
    //         expect(await heimdall.connect(foouser).hasRole(HEIMDALL_CONTRACT, baruser.address)).is.true
    //         expect(await heimdall.connect(foouser).hasRole(OWNER, baruser.address)).is.true
    //         expect(await heimdall.connect(foouser).hasRole(ADMIN, baruser.address)).is.true
    //         expect(await heimdall.connect(foouser).hasRole(STAFF, baruser.address)).is.true
    //         expect(await heimdall.connect(foouser).hasRole(SERVER, baruser.address)).is.true
    //
    //         // Manual revoking
    //         await heimdall.connect(hdlowner).revokeRole(HEIMDALL_OWNER, baruser.address)
    //         await heimdall.connect(hdlowner).revokeRole(HEIMDALL_CONTRACT, baruser.address)
    //         await heimdall.connect(hdlowner).revokeRole(OWNER, baruser.address)
    //         await heimdall.connect(owneruser).revokeRole(ADMIN, baruser.address)
    //         await heimdall.connect(adminuser).revokeRole(STAFF, baruser.address)
    //         await heimdall.connect(owneruser).revokeRole(SERVER, baruser.address)
    //         await purge_roles(baruser)
    //     }
    // })
    //
    // it('Role Management', async () => {
    //     // Reequire
    //     await expect(heimdall.connect(hdlowner).addRole('', 'PROJECT.STAFF', [])).is.revertedWith(INVALID_ROLE)
    //     await expect(heimdall.connect(hdlowner).addRole('OWNER', 'PROJECT.STAFF', [])).is.revertedWith(INVALID_ROLE)
    //     await expect(heimdall.connect(hdlowner).addRole('CONTRACT', 'PROJECT.STAFF', [])).is.revertedWith(INVALID_ROLE)
    //     await expect(heimdall.connect(hdlowner).addRole('PROJECT.OWNER', 'PROJECT.STAFF', [])).is.revertedWith(INVALID_ROLE)
    //     await expect(heimdall.connect(hdlowner).addRole('PROJECT.ADMIN', 'PROJECT.STAFF', [])).is.revertedWith(INVALID_ROLE)
    //     await expect(heimdall.connect(hdlowner).addRole('PROJECT.STAFF', 'PROJECT.STAFF', [])).is.revertedWith(INVALID_ROLE)
    //     await expect(heimdall.connect(hdlowner).addRole('PROJECT.SERVER', 'PROJECT.STAFF', [])).is.revertedWith(INVALID_ROLE)
    //
    //     await expect(heimdall.connect(hdlowner).addRole('AAA', 'XXX', [])).is.revertedWith(INVALID_ADMIN)
    //
    //     for(let account of [adminuser, staffuser, owneruser, serveruser]) {
    //         await expect(heimdall.connect(account).addRole('AAA', 'XXX', [])).is.revertedWith(NO_ACCESS)
    //     }
    //
    //     const FOO = keccak256(toUtf8Bytes('FOO'))
    //     await heimdall.connect(hdlowner).addRole('FOO', 'PROJECT.STAFF', [foouser.address])
    //     expect(await heimdall.connect(foouser).hasRole(FOO, foouser.address)).is.true
    //     expect(await heimdall.connect(foouser).hasRole(FOO, baruser.address)).is.false
    //
    //     await heimdall.connect(staffuser).grantRole(FOO, baruser.address)
    //     expect(await heimdall.connect(foouser).hasRole(FOO, baruser.address)).is.true
    //     expect(await heimdall.connect(foouser).hasRole(FOO, foouser.address)).is.true
    //
    //     for(let account of [foouser, baruser]) {
    //         await expect(heimdall.connect(account).revokeRole(FOO, baruser.address)).is.revertedWith(NO_ACCESS)
    //     }
    //
    //     await heimdall.connect(staffuser).revokeRole(FOO, baruser.address)
    //     expect(await heimdall.connect(foouser).hasRole(FOO, owneruser.address)).is.false
    //     expect(await heimdall.connect(foouser).hasRole(FOO, adminuser.address)).is.false
    //     expect(await heimdall.connect(foouser).hasRole(FOO, staffuser.address)).is.false
    //     expect(await heimdall.connect(foouser).hasRole(FOO, foouser.address)).is.true
    //     expect(await heimdall.connect(foouser).hasRole(FOO, baruser.address)).is.false
    //     expect(await heimdall.connect(foouser).hasRole(FOO, serveruser.address)).is.false
    // })
})