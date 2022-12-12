const { nanoid } = require("nanoid");
const fs = require('node:fs');
const notes = require('./data/notes.json');

const addNoteHandler = (request, h) => {

    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNotes = {
        title, tags, body, id, createdAt, updatedAt
    };
    notes.push(newNotes);

    fs.writeFileSync(__dirname + '/' + 'data/notes.json', JSON.stringify(notes));
    console.log(notes);

    const isSuccess = notes.filter((note) => {
        return note.id === id;
    }).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'note added',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'note fail to added',
    });
    response.code(500);
    return response;

};


const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.find((n) => {
        return n.id === id;
    });

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'note not found',
    });
    response.code(404);
    return response;

};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;

    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => {
        return note.id === id;
    });

    if (notes[index] !== undefined) {
        notes[index].title = title;
        notes[index].tags = tags;
        notes[index].body = body;
        notes[index].updatedAt = updatedAt;

        fs.writeFileSync(__dirname + '/' + 'data/notes.json', JSON.stringify(notes));

        const response = h.response({
            status: 'success',
            message: 'note updated'
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'fail updated note'
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (notes[index] !== undefined) {
        notes.splice(index, 1);
        fs.writeFileSync(__dirname + '/' + 'data/notes.json', JSON.stringify(notes));

        const response = h.response({
            status: 'success',
            message: 'note deleted'
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'fail deleted note'
    });
    response.code(404);
    return response;
};



module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler
};