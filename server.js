const express = require('express')
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');

const uri = "mongodb+srv://tancreznoan:test1804@cluster0.bij2fs8.mongodb.net/?retryWrites=true&w=majority"

const app = express();
app.use(bodyParser.json());
const port = 3000; 

app.use((req, res, next) => {
    console.log(`Requête recue : $(req.method) $(req.url) ${JSON.stringify(req.body)}`);
    next();
});

const client = new MongoClient(uri);
client.connect(err => {
    if(err){
        console.log("Erreur à la connexion à la base de données")
    } else {
        console.log("Connexion réussie")
    }
});

app.post('/utilisateurs', (request, response) =>{
    const {nom, prenom} = request.body;

    if(!nom || !prenom){
        return response.status(400).json({ erreur : "Veuillez fournir un nom et un prénom"});
    }

    const nouvelUtilisateur = {nom, prenom};
    const collection = client.db("myDb").collection("utilisateurs");

    try{
        const result = collection.insertOne(nouvelUtilisateur);
        console.log("Utilisateur ajouté avec succès");
        response.status(201).json(nouvelUtilisateur);
    }
    catch (error){
        console.error("Erreur lors de l'ajout d'utilisateurs", error)
        response.status(500).json({erreur : "Erreur lors de l'ajout d'utilisateur"})
    }
});

app.get('/utilisateurs', (request, response) => {
    const collection = client.db("myDb").collection("utilisateurs");
    collection.find().toArray((err, utilisateurs) => {
        if(err){
            console.error('Erreur lors de la recherche des utilisateurs :', error);
            response.status(500).send("Erreur interne du serveur")
        }
        else {
            response.json(utilisateurs);
        }
    });
});

app.listen(port, ()=>{
    console.log(`Serveur en cours d'execution sur le port : ${port}`)
});