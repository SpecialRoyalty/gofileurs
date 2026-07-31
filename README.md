# Bot Telegram GoFile Gate

Bot privé + groupe Telegram, déployable sur Railway avec PostgreSQL. Il verrouille le groupe, publie des offres GoFile gratuites, payantes ou déblocables par invitations, génère un lien unique par membre et valide les invités après une durée configurable.

## Préparation Telegram

1. Crée le bot avec `@BotFather`, puis désactive **Group Privacy** (`/setprivacy` → Disable).
2. Ajoute le bot au groupe principal comme administrateur.
3. Donne-lui les droits : supprimer les messages, bannir/restreindre, inviter via lien et modifier les permissions.
4. Récupère l’identifiant numérique du groupe (format `-100...`).

## Déploiement Railway

1. Place ce projet dans un dépôt GitHub et crée un projet Railway depuis ce dépôt.
2. Ajoute un service PostgreSQL Railway.
3. Dans les variables du service bot, renseigne les valeurs de `.env.example`. Railway fournit `DATABASE_URL` automatiquement si la base est liée.
4. Déploie. La commande de démarrage applique le schéma SQL avant de lancer le bot.

Variables obligatoires : `BOT_TOKEN`, `MAIN_GROUP_ID`, `DATABASE_URL`. Variables paiement : `PAYPAL_URL`, `REVOLUT_URL`, `PAYMENT_TEXT`. Les administrateurs sont détectés automatiquement à partir des administrateurs Telegram du groupe principal ; aucun identifiant administrateur ne doit être configuré.

`REISSUE_GUARANTEE_HOURS` règle la durée de garantie d’une livraison (72 heures par défaut). Le bouton d’indisponibilité n’apparaît que lorsque le contenu est réellement désactivé ou que sa date d’expiration est dépassée. Chaque livraison mémorise sa version.

`INACTIVE_REVIEW_DAYS` règle le contrôle des membres n’ayant jamais démarré le bot (3 jours par défaut).

## Utilisation

- En privé : `/start` ouvre l’interface membre ou administrateur.
- Admin → **Publier un GoFile** : titre, description, média facultatif, type d’accès, objectif/prix et lien.
- Admin → **Publications** : ouvre la fiche complète d’une publication avec son média, puis permet de republier, masquer/réactiver, changer la disponibilité du GoFile ou supprimer définitivement. Une suppression retire l’annonce et empêche tout nouvel accès, tout en conservant les accès déjà acquis et l’historique.
- Chaque fiche publication contient des **statistiques** : clics totaux et uniques, ouvertures privées traçables, déblocages, objectifs actifs et paiements par statut. Telegram ne fournit pas au bot les impressions réelles du message dans le groupe.
- **Modifier** permet de changer le titre, la description, le média, le prix d’une offre payante ou l’objectif d’une offre invitation sans recréer la campagne. Si elle est visible, son annonce est automatiquement actualisée.
- Admin → **Historique** affiche les actions récentes avec l’administrateur, la publication et la date : publication, modification, disponibilité, paiement, désactivation, réactivation et suppression.
- Admin → **Broadcast** : envoie immédiatement un texte, une photo ou une vidéo soit dans le groupe, soit à tous les membres ayant déjà ouvert le bot. Les utilisateurs qui ont bloqué le bot sont ignorés sans interrompre l’envoi.
- Admin → **Pubs automatiques** : crée plusieurs publicités et active/désactive chacune. Toutes les 6 heures, le bot publie la prochaine publicité active de la rotation et supprime le message publicitaire précédent, de sorte qu’une seule pub automatique reste visible dans le groupe.
- Admin → **Mots interdits** : envoie `+ cp` pour ajouter le mot entier `cp`, ou `- cp` pour le retirer. Ainsi `sell cp now` est rejeté, tandis que `jscpquoi` reste accepté.
- Après **J’ai payé**, le membre doit obligatoirement envoyer une preuve en photo ou document. L’admin reçoit la preuve avec les boutons de validation ; une demande ne peut être validée qu’une fois.
- Dans **Mes accès**, un objectif actif affiche sa progression (`Titre — 20/30 invitations`). Sa fiche contient le média, les informations et un abandon avec confirmation.
- Dans **Mes accès**, la liste garde un seul bouton par dossier. Un clic ouvre sa fiche complète (média, titre, description et type) avec **Ouvrir le lien** et **Signaler**.
- **Signaler** propose **Bug** (le membre écrit son message, transmis aux admins avec le dossier concerné) ou **Lien mort** (ajout à la file de rediffusion). Le signalement est toujours permis pour un accès payant ou invitation et pour le premier accès gratuit. À partir du deuxième accès gratuit, il exige au moins une invitation validée.
- Renoncer remet définitivement la progression active à zéro. Reprendre cet objectif ou en choisir un autre commence à `0` ; aucun avancement n’est transféré.
- Un lien mort peut être signalé pendant la garantie de rediffusion. Une demande unique est créée pour le membre, le dossier et sa version ; les clics répétés ne créent aucun doublon. Admin → **Liens expirés** affiche les attentes. Quand l’admin remplace le lien, le bot le renvoie automatiquement aux membres en attente, actualise leur version et leur garantie, puis clôt leurs demandes. Un seul signalement ne désactive pas automatiquement le dossier pour tous : l’admin garde cette décision dans la fiche publication.

## Sécurité et limites Telegram

- Le bot quitte automatiquement tout groupe différent de `MAIN_GROUP_ID`.
- Il refuse de démarrer s’il n’est pas administrateur du groupe principal.
- Les messages ordinaires des non-admins et les messages d’entrée/sortie sont supprimés.
- Telegram ne livre l’information du lien utilisé que si le bot reçoit les mises à jour `chat_member`; elles sont activées ici.
- Un utilisateur déjà vu comme invité n’est compté qu’une fois, même s’il quitte puis revient.
- Un invité qui quitte avant la validation interne n’est pas compté. Une invitation déjà validée reste acquise si la personne quitte plus tard. Les membres arrivés par le lien principal ne sont attribués à aucun parrain. Le bot ne peut pas connaître la dernière connexion ou les lectures Telegram et n’expulse donc personne automatiquement pour « inactivité ».
- Pour les arrivées observées après l’installation de cette fonction, le bot demande périodiquement aux administrateurs s’ils souhaitent retirer les membres présents depuis le délai configuré qui n’ont jamais lancé `/start`. Un refus conserve et cumule la liste au contrôle suivant. Une acceptation les retire sans bannissement permanent. Telegram ne permet pas de découvrir rétroactivement tous les membres déjà présents.

## Développement local

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Vérification : `npm run check` puis `npm run build`.
