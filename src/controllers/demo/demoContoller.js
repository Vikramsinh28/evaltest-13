const APIResponseFormat = require('../../utils/APIResponseFormat.js');
const DemoService = require('../../services/demo/demoServices.js');
const EventEmitters = require('events');
const { _doDecrypt } = require('../../utils/encryption.js');

const event = new EventEmitters();

event.on("Demofetch", () => {
    console.log("All Demos are fetched");
});

event.on("DemoAdd", () => {
    console.log("Demo is added");
});

event.on("DemoUpdate", () => {
    console.log("Demo is updated");
});

event.on("DemoDelete", () => {
    console.log("Demo is deleted");
});

event.on("restoreDemo", () => {
    console.log("Demo is restored");
});


const demo = async (req, res) => {
    try {
        const demo = await DemoService.demo();
        event.emit("Demofetch");
        return APIResponseFormat._ResDataFound(res, demo);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const addDemo = async (req, res) => {
    try {
        const { name, age , email } = req.body;
        const regex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

        if (!name || !age || !email) {
            return APIResponseFormat._ResMissingRequiredField(res, "Name and Age and Email are required");
        }

        if(!regex.test(email)){
            return APIResponseFormat._ResMissingRequiredField(res, "Email is not valid");
        }
        
        // check if demo already exists
        const demo = await DemoService.uniqueDemo(name);
        if (demo.length > 0) {
            return APIResponseFormat._ResDuplicateEntry(res, "Demo already exists");
        }

        // check if email already exists
        const emailExists = await DemoService.deletedEmailExists(email);
        if(emailExists.length && emailExists[0].deleted_at){
            const restoreDemo = await DemoService.restoreDemo(emailExists[0].id);
            event.emit("restoreDemo");
            return APIResponseFormat._ResDataUpdated(res, restoreDemo);
      }  else if(emailExists){
            return APIResponseFormat._ResDuplicateEntry(res, "Email already exists");
      }else {
            const newDemo = await DemoService.addDemo(req.body);
            event.emit("DemoAdd");
            return APIResponseFormat._ResDataCreated(res, newDemo);
        }

    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const updateDemo = async (req, res) => {
    try {
        const { name, age , email } = req.body;
        const id = _doDecrypt(req.header('id'));
        const regex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

        if (!name || !age || !email) {
            return APIResponseFormat._ResMissingRequiredField(res, "Name and Age and Email are required");
        }

        if(!id){
            return APIResponseFormat._ResMissingRequiredField(res, "Id is required");
        }
        
        if(!regex.test(email)){
            return APIResponseFormat._ResMissingRequiredField(res, "Email is not valid");
        }
        
        // check if demo already exists
        const demo = await DemoService.uniqueDemo(name);
        if (demo.length > 0) {
            return APIResponseFormat._ResDuplicateEntry(res, "Demo already exists");
        }

        const updatedDemo = await DemoService.updateDemo(id, req.body);
        event.emit("DemoUpdate");
        return APIResponseFormat._ResDataUpdated(res, updatedDemo);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const deleteDemo = async (req, res) => {
    try {
        const id = _doDecrypt(req.header('id'));
        if (!id) {
            return APIResponseFormat._ResMissingRequiredField(res, "Id is required");
        }
        const deletedDemo = await DemoService.deleteDemo(id);
        event.emit("DemoDelete");
        return APIResponseFormat._ResDataDeleted(res, deletedDemo);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}


// restore the soft deleted demo 




module.exports = {
    demo,
    addDemo,
    updateDemo,
    deleteDemo
}