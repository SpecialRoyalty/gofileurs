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

## Utilisation

- En privé : `/start` ouvre l’interface membre ou administrateur.
- Admin → **Publier un GoFile** : titre, description, média facultatif, type d’accès, objectif/prix et lien.
- Admin → **Publications** : ouvre la fiche complète d’une publication avec son média, puis permet de republier, masquer/réactiver, changer la disponibilité du GoFile ou supprimer définitivement. Une suppression retire l’annonce et empêche tout nouvel accès, tout en conservant les accès déjà acquis et l’historique.
- Admin → **Broadcast** : envoie immédiatement un texte, une photo ou une vidéo soit dans le groupe, soit à tous les membres ayant déjà ouvert le bot. Les utilisateurs qui ont bloqué le bot sont ignorés sans interrompre l’envoi.
- Admin → **Pubs automatiques** : crée plusieurs publicités et active/désactive chacune. Toutes les 6 heures, le bot publie la prochaine publicité active de la rotation et supprime le message publicitaire précédent, de sorte qu’une seule pub automatique reste visible dans le groupe.
- Admin → **Mots interdits** : envoie `+ cp` pour ajouter le mot entier `cp`, ou `- cp` pour le retirer. Ainsi `sell cp now` est rejeté, tandis que `jscpquoi` reste accepté.
- Après **J’ai payé**, le membre doit obligatoirement envoyer une preuve en photo ou document. L’admin reçoit la preuve avec les boutons de validation ; une demande ne peut être validée qu’une fois.
- Dans **Mes accès**, un objectif actif affiche sa progression (`Titre — 20/30 invitations`). Sa fiche contient le média, les informations et un abandon avec confirmation.
- Renoncer remet définitivement la progression active à zéro. Reprendre cet objectif ou en choisir un autre commence à `0` ; aucun avancement n’est transféré.
- Un contenu débloqué peut être signalé comme indisponible uniquement lorsque son statut ou sa date d’expiration le justifie. Admin → **Liens expirés** permet de remplacer puis rediffuser le lien.

## Sécurité et limites Telegram

- Le bot quitte automatiquement tout groupe différent de `MAIN_GROUP_ID`.
- Il refuse de démarrer s’il n’est pas administrateur du groupe principal.
- Les messages ordinaires des non-admins et les messages d’entrée/sortie sont supprimés.
- Telegram ne livre l’information du lien utilisé que si le bot reçoit les mises à jour `chat_member`; elles sont activées ici.
- Un utilisateur déjà vu comme invité n’est compté qu’une fois, même s’il quitte puis revient.

## Développement local

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Vérification : `npm run check` puis `npm run build`.
