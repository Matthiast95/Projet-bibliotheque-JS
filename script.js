let livres = [];
let utilisateurs = [];
let emprunts = [];
let prochainIdLivre = 1;
let prochainIdUtilisateur = 1;
let prochainIdEmprunt = 1;

// Récupérer les livres du localStorage au chargement
const livresLocal = localStorage.getItem('livres');
if (livresLocal) {
    livres = JSON.parse(livresLocal);
}
// Récupérer les utilisateurs du localStorage au chargement
const utilisateursLocal = localStorage.getItem('utilisateurs');
if (utilisateursLocal) {
    utilisateurs = JSON.parse(utilisateursLocal);
}
// Récupérer les emprunts du localStorage au chargement
const empruntsLocal = localStorage.getItem('emprunts');
if (empruntsLocal) {
    emprunts = JSON.parse(empruntsLocal);
}

document.addEventListener('DOMContentLoaded', function() {
    afficherLivres();
    afficherUtilisateurs();
    afficherEmprunts();
});
// Appelle cette fonction au chargement et après chaque ajout d'utilisateur
document.addEventListener('DOMContentLoaded', remplirSelectUtilisateurs);
// Appelle cette fonction au chargement et après chaque ajout de livre
document.addEventListener('DOMContentLoaded', remplirSelectLivres);

/*******************************GESTION DE LIVRES  *********************************************/

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
    // Sauvegarder dans le localStorage
    localStorage.setItem('livres', JSON.stringify(livres));
    console.log("Livre ajouté avec succès");
    remplirSelectLivres();
    afficherLivres();
    return { succes: true, message: "Livre ajouté avec succès", livre: nouveauLivre };
}

function afficherLivres() {
    const liste = document.getElementById('liste-livres');
    if (!liste) return;
    // Vide le contenu précédent
    liste.innerHTML = '';
    // Ajoute chaque livre
    livres.forEach(livre => {
        const item = document.createElement('div');
        item.className = 'liste-item';
        item.textContent = `${livre.titre} - ${livre.auteur} (${livre.quantiteDisponible}/${livre.quantiteTotal})`;
        // Bouton supprimer
        const bouton = document.createElement('button');
        bouton.textContent = 'Supprimer';
        bouton.onclick = function() {
            supprimerLivre(livre.id);
            // Mettre à jour le localStorage
            localStorage.setItem('livres', JSON.stringify(livres));
            afficherLivres();
        };
        item.appendChild(bouton);
        liste.appendChild(item);
    });
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

function remplirSelectLivres() {
    const select = document.getElementById('livreIdEmprunt');
    if (!select) return;
    select.innerHTML = '';
    livres.forEach(livre => {
        const option = document.createElement('option');
        option.value = livre.id;
        option.textContent = livre.titre + ' - ' + livre.auteur;
        select.appendChild(option);
    });
}


/************************************GESTION DES UTILISATEURS ***********************************/

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
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs)); // Sauvegarder dans le localStorage
    console.log("Utilisateur ajouté avec succès");
    remplirSelectUtilisateurs();
    afficherUtilisateurs();
    return { succes: true, message: "Utilisateur ajouté avec succès", utilisateur: nouvelUtilisateur };
}

function afficherUtilisateurs() {
    const liste = document.getElementById('liste-utilisateurs');
    if (!liste) return;
    liste.innerHTML = '';
    utilisateurs.forEach(utilisateur => {
        const item = document.createElement('div');
        item.className = 'liste-item';
        item.textContent = `${utilisateur.nom} ${utilisateur.prenom} (${utilisateur.email})`;
        // Bouton supprimer
        const bouton = document.createElement('button');
        bouton.textContent = 'Supprimer';
        bouton.onclick = function() {
            supprimerUtilisateur(utilisateur.id);
            localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
            afficherUtilisateurs();
            remplirSelectUtilisateurs();
        };
        item.appendChild(bouton);
        liste.appendChild(item);
    });
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

function remplirSelectUtilisateurs() {
    const select = document.getElementById('utilisateurIdEmprunt');
    if (!select) return;
    select.innerHTML = '';
    utilisateurs.forEach(utilisateur => {
        const option = document.createElement('option');
        option.value = utilisateur.id;
        option.textContent = utilisateur.nom + ' ' + utilisateur.prenom;
        select.appendChild(option);
    });
}


/**************************GESTION DES EMPRUNTS ********************************/

function livreDisponible(livreId){
    const livre = livres.find(livres => livres.id === Number(livreId)); // Trouver le livre avec son ID
    if(livre.quantiteDisponible > 0){
        return true;
    }
    else{
        return false;
    }
}

function decrementerQuantite(livreId){
    const livre = livres.find(livres => livres.id === Number(livreId));
    livre.quantiteDisponible--; // Décremntation de la quantité disponible pour le livre
    afficherLivres();
}

function incrementerQuantite(livreId){
    const livre = livres.find(livres => livres.id === Number(livreId));
    livre.quantiteDisponible++; // Incrémentation de la quantité disponible pour le livre
    afficherLivres();
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
    console.log(livreId);
    console.log(utilisateurId);
    if(!utilisateurId || !livreId){
        console.log("Tous les champs sont obligatoires");
        return { succes : false, message: "Tous les champs sont obligatoires"};
    }
    const livre = livres.find(livre => livre.id === Number(livreId)); // Trouver le livre avec son ID
    console.log(livre);
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
    localStorage.setItem('emprunts', JSON.stringify(emprunts)); // Sauvegarder dans le localStorage
    decrementerQuantite(livreId);
    console.log("Livre emprunté avec succès");
    afficherEmprunts();
    return { succes: true, message: "Livre emprunté avec succès"};
}

function retournerLivre(empruntId) {
    // Marquer l'emprunt comme retourné et incrémenter la quantité
    if(!empruntId){
        console.log("Tous les champs sont obligatoires");
        return { succes : false, message: "Tous les champs sont obligatoires"};
    }
    const emprunt = emprunts.find(emprunts => emprunts.id === Number(empruntId));
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
    const liste = document.getElementById('liste-emprunts');
    if (!liste) return;
    liste.innerHTML = '';
    emprunts.forEach(emprunt => {
        if (emprunt.statut === 'actif') {
            const utilisateur = utilisateurs.find(utilisateurs => utilisateurs.id === Number(emprunt.utilisateurId));
            const livre = livres.find(livres => livres.id === Number(emprunt.livreId));
            const item = document.createElement('div');
            item.className = 'liste-item';
            item.textContent = `Emprunt #${emprunt.id} : ${utilisateur ? utilisateur.nom + ' ' + utilisateur.prenom : 'Utilisateur inconnu'} a emprunté "${livre ? livre.titre : 'Livre inconnu'}" le ${emprunt.dateEmprunt}`;
            // Bouton retourné
            const bouton = document.createElement('button');
            bouton.textContent = 'Retourné';
            bouton.onclick = function() {
                retournerLivre(emprunt.id);
                localStorage.setItem('emprunts', JSON.stringify(emprunts));
                afficherEmprunts();
                afficherLivres();
            };
            item.appendChild(bouton);
            liste.appendChild(item);
        }
    });
}



/*******************************GESTION DES BOUTONS **************************/

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
