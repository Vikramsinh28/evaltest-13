const db = require("../../db/models/index");
const Demo = db.demo;

const demo = async (req, res) => {
    try {
        const demo = await Demo.findAll();
        return demo
    } catch (error) {
        throw error;
    }
}

const deletedEmailExists = async (email) => {
    try {
        const demo = await Demo.findAll({
            where: {
                email: email
            } , paranoid: false
        });
        return demo
    } catch (error) {
        throw error;
    }
}


const uniqueDemo = async (name) => {
    try {
        const demo = await Demo.findAll({
            where: {
                name: name
            }
        });
        return demo
    } catch (error) {
        throw error;
    }
}

const uniqueEmail = async (email) => {
    try {
        const demo = await Demo.findAll({
            where: {
                email: email
            }
        });
        return demo
    } catch (error) {
        throw error;
    }
}



const addDemo = async (demo) => {
    try {
        const newDemo = await Demo.create(demo);
        return newDemo
    } catch (error) {
        throw error;
    }
}

const updateDemo = async (id, demo) => {
    try {
        const updatedDemo = await Demo.update(demo, {
            where: {
                id: id
            }
        });
        return updatedDemo
    } catch (error) {
        throw error;
    }
}

const deleteDemo = async (id) => {
    try {
        const deletedDemo = await Demo.destroy({
            where: {
                id: id
            }
        });
        return deletedDemo
    } catch (error) {
        throw error;
    }
} 

const restoreDemo = async (id) => {
    try {
        const restoredDemo = await Demo.restore({
            where: {
                id: id
            }
        });
        return restoredDemo
    } catch (error) {
        throw error;
    }
}

module.exports = {
    demo,
    addDemo,
    updateDemo,
    deleteDemo,
    uniqueDemo,
    uniqueEmail,
    restoreDemo,
    deletedEmailExists
}