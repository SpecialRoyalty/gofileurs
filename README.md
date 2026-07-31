# Bot Telegram GoFile Gate

Bot privé + groupe Telegram, déployable sur Railway avec PostgreSQL. Il verrouille le groupe, publie des offres GoFile gratuites, payantes ou déblocables par invitations, génère un lien unique par membre et valide les invités après une durée configurable.

## Préparation Telegram

1. Crée le bot avec `@BotFather`, puis désactive **Group Privacy** (`/setprivacy` → Disable).
2. Ajoute le bot au groupe principal comme administrateur.
3. Donne-lui les droits : supprimer les messages, bannir/restreindre, inviter via lien et modifier les permissions.
4. Récupère l’identifiant numérique du groupe (format `-100...`) et ton identifiant Telegram.

## Déploiement Railway

1. Place ce projet dans un dépôt GitHub et crée un projet Railway depuis ce dépôt.
2. Ajoute un service PostgreSQL Railway.
3. Dans les variables du service bot, renseigne les valeurs de `.env.example`. Railway fournit `DATABASE_URL` automatiquement si la base est liée.
4. Déploie. La commande de démarrage applique le schéma SQL avant de lancer le bot.

Variables obligatoires : `BOT_TOKEN`, `ADMIN_IDS` (plusieurs IDs séparés par des virgules), `MAIN_GROUP_ID`, `DATABASE_URL`. Variables paiement : `PAYPAL_URL`, `REVOLUT_URL`, `PAYMENT_TEXT`.

`REISSUE_GUARANTEE_HOURS` règle la durée pendant laquelle un bénéficiaire peut utiliser le bouton **Lien expiré** (72 heures par défaut). Chaque livraison mémorise sa version : une demande identique ne peut pas être créée deux fois et un ancien bénéficiaire ne reçoit jamais silencieusement une version plus récente.

## Utilisation

- En privé : `/start` ouvre l’interface membre ou administrateur.
- Admin → **Publier un GoFile** : titre, description, média facultatif, type d’accès, objectif/prix et lien.
- Admin → **Broadcast** : envoie immédiatement un texte, une photo ou une vidéo soit dans le groupe, soit à tous les membres ayant déjà ouvert le bot. Les utilisateurs qui ont bloqué le bot sont ignorés sans interrompre l’envoi.
- Admin → **Pubs automatiques** : crée plusieurs publicités et active/désactive chacune. Toutes les 6 heures, le bot publie la prochaine publicité active de la rotation et supprime le message publicitaire précédent, de sorte qu’une seule pub automatique reste visible dans le groupe.
- Admin → **Mots interdits** : envoie `+ cp` pour ajouter le mot entier `cp`, ou `- cp` pour le retirer. Ainsi `sell cp now` est rejeté, tandis que `jscpquoi` reste accepté.
- Un accès payant n’est livré qu’après validation manuelle par un admin.
- Dans **Mes accès**, le membre peut signaler un lien expiré pendant la garantie. Admin → **Liens expirés** permet de remplacer le lien et de le renvoyer aux demandes en attente, ou exceptionnellement à tous les bénéficiaires. Seuls les envois réussis sont marqués comme rediffusés.
- Renoncer à un objectif conserve le solde d’invitations déjà validées. Lorsqu’un objectif consomme 20 invitations sur un solde de 21, le solde suivant vaut 1.

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
