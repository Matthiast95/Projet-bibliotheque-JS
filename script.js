/*
const bibliotheque = {
    livres: [],
    utilisateurs: [],
    emprunts: [],
    prochainIdLivre: 1,
    prochainIdUtilisateur: 1,
    prochainIdEmprunt: 1
};*/

let livres = [];
let utilisateurs = [];
let emprunts = [];
let prochainIdLivre = 1;
let prochainIdUtilisateur = 1;
let prochainIdEmprunt = 1;

function ajouterLivre(titre, auteur, quantite){
    if(!titre || !quantite || !auteur){
        console.log("Tous les champs sont obligatoires");
        return { succes : false, message: "Tous les champs sont obligatoires" };
    }
    const nouveauLivre = {
        id: prochainIdLivre++,
        titre: titre,
        auteur: auteur,
        quantiteTotal : quantite,
        quantiteDisponible : quantite
    };
    
    livres.push(nouveauLivre); // Ajout du livre 
    console.log("Livre ajouté avec succès");
    return { succes: true, message: "Livre ajouté avec succès", livre: nouveauLivre };
}

function afficherLivres() {
    // Afficher la liste des livres dans le DOM
    console.log(livres);
}


function supprimerLivre(id) {
    const index = livres.findIndex(livre => livre.id === id); // Trouver l'index du livre par son ID
    
    if (index !== -1) {
        const livreSupprime = livres.splice(index, 1)[0]; // Suppression du livre
        console.log(`Livre "${livreSupprime.titre}" supprimé`);
        return livreSupprime;
    }
    
    console.log(`Livre avec ID ${id} non trouvé`);
    return null;
}

function ajouterUtilisateur(nom, prenom, email) {
    if(!nom || !prenom || !email){
        console.log("Tous les champs sont obligatoires");
        return { succes : false, message: "Tous les champs sont obligatoires" };
    }
    // Créer et ajouter un utilisateur
    const nouvelUtilisateur = {
        id : prochainIdUtilisateur++,
        nom : nom,
        prenom : prenom,
        email : email
    };
    
    utilisateurs.push(nouvelUtilisateur); // Ajout de l'utilisateur
    console.log("Utilisateur ajouté avec succès");
    return { succes: true, message: "Utilisateur ajouté avec succès", utilisateur: nouvelUtilisateur };
}

function afficherUtilisateurs() {
    // Afficher la liste des utilisateurs dans le DOM
    console.log(utilisateurs);
}

function supprimerUtilisateur(id) {
    const index = utilisateurs.findIndex(utilisateurs => utilisateurs.id === id); //Trouver l'index de l'utilisateur avec son ID

    if (index !== -1) {
        const utilisateurSupprime = utilisateurs.splice(index, 1)[0]; // Supprimer un utilisateur par son ID
        console.log(`Utilisateur "${utilisateurSupprime.id}" supprimé`);
        return utilisateurSupprime;
    }
    
    console.log(`Utilisateur avec ID ${id} non trouvé`);
    return null;
}

function livreDisponible(livreId){
    const livre = livres.find(livres => livres.id === livreId); // Trouver le livre avec son ID
    if(livre.quantiteDisponible > 0){
        return true;
    }
    else{
        return false;
    }
}

function decrementerQuantite(livreId){
    const livre = livres.find(livres => livres.id === livreId);
    livre.quantiteDisponible--; // Décremntation de la quantité disponible pour le livre
}

function incrementerQuantite(livreId){
    const livre = livres.find(livres => livres.id === livreId);
    livre.quantiteDisponible++; // Incrémentation de la quantité disponible pour le livre
}

function verifierEmpruntExistant(utilisateurId, livreId) {
    // Trouver si l'emprunt existe déjà et si il est actif
    return emprunts.find(emprunt => 
        emprunt.utilisateurId === utilisateurId && 
        emprunt.livreId === livreId && 
        emprunt.statut === 'actif'
    );
}

function emprunterLivre(utilisateurId, livreId) {
    // Créer un emprunt et décrémenter la quantité
    if(!utilisateurId || !livreId){
        console.log("Tous les champs sont obligatoires");
        return { succes : false, message: "Tous les champs sont obligatoires"};
    }
    const livre = livres.find(livres => livres.id === livreId); // Trouver le livre avec son ID
    if(!livre){
        console.log("Livre non trouvé");
        return { succes : false, message: "Livre non trouvé"};
    }
    if(!livreDisponible(livreId)){
        console.log("Livre en rupture de stock");
        return { succes: false, message: "Livre en rupture de stock"};
    }
    if(verifierEmpruntExistant(utilisateurId, livreId)){
        console.log("L'utilisateur a déjà emprunter ce livre");
        return { succes: false, message: "L'utilisateur a déjà emprunter ce livre"};
    }
    const emprunt = {
    id: prochainIdEmprunt++,
    utilisateurId: utilisateurId,
    livreId: livreId,
    dateEmprunt: new Date().toLocaleDateString(),
    statut: "actif"
    };
    emprunts.push(emprunt); // Ajout de l'emprunt
    decrementerQuantite(livreId);
    console.log("Livre emprunté avec succès");
    return { succes: true, message: "Livre emprunté avec succès"};
}

function retournerLivre(empruntId) {
    // Marquer l'emprunt comme retourné et incrémenter la quantité
    if(!empruntId){
        console.log("Tous les champs sont obligatoires");
        return { succes : false, message: "Tous les champs sont obligatoires"};
    }
    const emprunt = emprunts.find(emprunts => emprunts.id === empruntId);
    if(!emprunt){
        console.log("Emprunt non trouvé");
        return {succes: false, message: "Emprunt non trouvé"};
    }
    emprunt.statut = "retourné";
    incrementerQuantite(emprunt.livreId);
    console.log("Livre retourné avec succès");
    return {succes: true, message: "Livre retourné avec succès"};
}

function afficherEmprunts() {
    // Afficher la liste des emprunts actifs
    console.log(emprunts);
}

document.addEventListener('DOMContentLoaded', function(){
    const formulaire = document.getElementById('form-livre');
    if (!formulaire) return;
    formulaire.addEventListener('submit', function(event){
        event.preventDefault();
        const titre = document.getElementById('titreLivre').value;
        const auteur = document.getElementById('auteurLivre').value;
        const quantite = document.getElementById('quantiteLivre').value;
        ajouterLivre(titre, auteur, quantite);
    });
});

document.addEventListener('DOMContentLoaded', function(){
    const formulaire = document.getElementById('form-utilisateur');
    if (!formulaire) return;
    formulaire.addEventListener('submit', function(event){
        event.preventDefault();
        const nom = document.getElementById('nomUtilisateur').value;
        const prenom = document.getElementById('prenomUtilisateur').value;
        const email = document.getElementById('emailUtilisateur').value;
        ajouterUtilisateur(nom,prenom,email);
    });
});

document.addEventListener('DOMContentLoaded', function(){
    const formulaire = document.getElementById('form-emprunt');
    if (!formulaire) return;
    formulaire.addEventListener('submit', function(event){
        event.preventDefault();
        const utilisateurId = document.getElementById('utilisateurIdEmprunt').value;
        const livreId = document.getElementById('livreIdEmprunt').value;
        emprunterLivre(utilisateurId, livreId);
    });
});


ajouterLivre("Harry Potter","J.K. Rowling", 3);
//ajouterLivre("Le Seigneur des Anneaux","J.R.R. Tolkien", 2);
console.log(livres);
ajouterUtilisateur("Douez","Theo","theo.douez@ingetis.com");
console.log(utilisateurs);
//emprunterLivre(1,2);
emprunterLivre(1,1);
console.log(emprunts);
//retournerLivre(1);
//console.log(emprunts);
/**
supprimerLivre(1);
afficherLivres();
supprimerUtilisateur(1);
afficherUtilisateurs();
*/
