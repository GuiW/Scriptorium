/*
 * Data entry point of feature-quests (`@scriptorium/feature-quests/data`): the quest model and
 * QuestsStore, which the app may import eagerly (the shell's quest counter). Nothing routed here,
 * so importing it does not pull the Quêtes page into the main bundle. The mock data stays
 * private: everything reads the quests through the store.
 */

export * from './quest';
export * from './quests.store';
