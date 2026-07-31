import { Markup } from 'telegraf';
export const home = (admin=false) => Markup.inlineKeyboard([
  [Markup.button.callback('📦 Mes accès','access'),Markup.button.callback('🎯 Invitations','invites')],
  [Markup.button.callback('🔔 Notifications','notifications')],
  ...(admin ? [[Markup.button.callback('🛠 Administration','admin')]] : [])
]);
export const back = Markup.inlineKeyboard([[Markup.button.callback('⬅️ Retour','home')]]);
export const admin = Markup.inlineKeyboard([
 [Markup.button.callback('➕ Publier un GoFile','new_campaign')],
 [Markup.button.callback('📣 Broadcast','broadcast'),Markup.button.callback('⏱ Pubs automatiques','ads')],
 [Markup.button.callback('♻️ Liens expirés','reissues')],
 [Markup.button.callback('📋 Publications','campaigns'),Markup.button.callback('🚫 Mots interdits','words')],
 [Markup.button.callback('📨 Signalements','reports'),Markup.button.callback('🧾 Historique','audit_logs')],[Markup.button.callback('⬅️ Retour','home')]
]);
