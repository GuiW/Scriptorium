/* @ds-bundle: {"format":4,"namespace":"Grimoire","components":[{"name":"Button"},{"name":"Badge"},{"name":"TextField"},{"name":"Objective"},{"name":"QuestCard"},{"name":"JournalEntry"},{"name":"Reputation"},{"name":"ContactChip"},{"name":"ContactCard"},{"name":"BookmarkNav"},{"name":"BookmarkTabs"},{"name":"Tabs"},{"name":"Visibility"},{"name":"SecretBlock"},{"name":"VisibilityPicker"},{"name":"RewardList"},{"name":"Icon"}]} */
(function () {
  var R = window.React;
  var h = R.createElement;
  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(' ');
  }

  var STATUS = {
    active: { glyph: '\u25C6', label: 'En cours' },
    completed: { glyph: '\u2713', label: 'Accomplie' },
    failed: { glyph: '\u2715', label: '\u00C9chou\u00E9e' },
    rumor: { glyph: '?', label: 'Rumeur' },
    urgent: { glyph: '!', label: 'Urgent' },
    reward: { glyph: '\u2726', label: 'R\u00E9compense' }
  };

  function Button(p) {
    return h('button', {
      type: p.type || 'button',
      className: cx('gr-btn', 'gr-btn--' + (p.variant || 'primary'), p.size === 'sm' && 'gr-btn--sm', p.className),
      disabled: p.disabled, onClick: p.onClick, 'aria-label': p['aria-label']
    }, p.icon ? h('span', { className: 'gr-btn__icon', 'aria-hidden': true }, p.icon) : null, p.children);
  }

  function Badge(p) {
    var tone = p.tone || 'active';
    var s = STATUS[tone] || STATUS.active;
    return h('span', { className: cx('gr-badge', 'gr-badge--' + tone, p.className) },
      p.glyph === false ? null : h('span', { className: 'gr-badge__glyph', 'aria-hidden': true }, p.glyph || s.glyph),
      p.children != null ? p.children : s.label);
  }

  var fieldId = 0;
  function TextField(p) {
    var ref = R.useRef(null);
    if (ref.current == null) ref.current = p.id || 'gr-field-' + (++fieldId);
    var id = ref.current;
    var hintId = p.hint || p.error ? id + '-hint' : undefined;
    var props = {
      id: id, className: 'gr-field__input', value: p.value, defaultValue: p.defaultValue,
      placeholder: p.placeholder, onChange: p.onChange, 'aria-describedby': hintId,
      'aria-invalid': p.error ? true : undefined, rows: p.multiline ? (p.rows || 4) : undefined
    };
    return h('div', { className: cx('gr-field', p.error && 'gr-field--error', p.className) },
      h('label', { className: 'gr-field__label', htmlFor: id }, p.label),
      h(p.multiline ? 'textarea' : 'input', props),
      hintId ? h('div', { className: 'gr-field__hint', id: hintId }, p.error || p.hint) : null);
  }

  var objId = 0;
  function Objective(p) {
    // the label is a <label> for the box: its text names the checkbox and a click anywhere on it toggles
    var ref = R.useRef(null);
    if (ref.current == null) ref.current = 'gr-obj-' + (++objId);
    var restricted = p.visibility && p.visibility.level && p.visibility.level !== 'table';
    return h('li', { className: cx('gr-obj', p.done && 'gr-obj--done', restricted && 'gr-obj--restricted', p.className) },
      h('button', {
        id: ref.current, type: 'button', className: 'gr-obj__box', role: 'checkbox', 'aria-checked': !!p.done,
        onClick: p.onToggle
      }),
      h('label', { className: 'gr-obj__label', htmlFor: ref.current }, h('span', { className: 'gr-obj__text' }, p.children),
        p.optional ? h('span', { className: 'gr-obj__optional' }, '(facultatif)') : null,
        restricted ? h(Visibility, { level: p.visibility.level, players: p.visibility.players, compact: true, className: 'gr-obj__vis' }) : null));
  }

  function QuestCard(p) {
    var objs = p.objectives || [];
    var done = objs.filter(function (o) { return o.done; }).length;
    var status = p.status || 'active';
    var vis = (p.visibility && p.visibility.level) || 'table';
    var rewards = p.rewards || (p.reward ? [{ kind: 'coin', label: p.reward }] : []);
    var pct = objs.length ? Math.round(done / objs.length * 100) : 0;
    var parts = [p.giver ? h(R.Fragment, { key: 'g' }, 'Donn\u00E9e par ', p.giver) : null, p.location, p.level != null ? 'Niv. ' + p.level : null].filter(Boolean);
    var meta = parts.length ? parts.reduce(function (acc, x, i) { if (i) acc.push(' \u00B7 '); acc.push(h('span', { key: 'm' + i, className: 'gr-nowrap' }, x)); return acc; }, []) : null;
    // selectable card: a button inside the title, stretched over the card by CSS (a button cannot hold the heading and lists)
    var title = p.onClick
      ? h('button', { type: 'button', className: 'gr-quest__open', onClick: p.onClick, 'aria-pressed': !!p.selected }, p.title)
      : p.title;
    return h('article', {
      className: cx('gr-quest', 'gr-quest--' + status, (p.showObjectives || p.showRewards) && 'gr-quest--detailed', p.selected && 'gr-quest--selected', vis !== 'table' && 'gr-quest--restricted', vis === 'players' && 'gr-quest--restricted-players', p.className)
    },
      vis !== 'table' ? h('div', { className: 'gr-quest__vis' }, h(Visibility, { level: vis, players: p.visibility.players })) : null,
      h('div', { className: 'gr-quest__head' },
        h('div', null, h('h3', { className: 'gr-quest__title' }, title), meta ? h('div', { className: 'gr-quest__meta' }, meta) : null),
        h(Badge, { tone: status })),
      p.summary ? h('p', { className: 'gr-quest__summary' }, p.summary) : null,
      p.showObjectives && objs.length ? h('ul', { className: 'gr-objs' }, objs.map(function (o, i) {
        return h(Objective, { key: i, done: o.done, optional: o.optional, visibility: o.visibility }, o.label);
      })) : null,
      p.showRewards && rewards.length ? h(RewardList, { rewards: rewards, className: 'gr-quest__rewards' }) : null,
      !objs.length && !rewards.length ? null : h('div', { className: 'gr-quest__foot' },
        objs.length ? h('div', { className: 'gr-track', role: 'progressbar', 'aria-valuenow': done, 'aria-valuemin': 0, 'aria-valuemax': objs.length, 'aria-label': 'Objectifs' },
          h('div', { className: 'gr-track__fill', style: { width: pct + '%' } })) : h('div', { style: { flex: 1 } }),
        objs.length ? h('span', { className: 'gr-count' }, done + '/' + objs.length) : null,
        rewards.length && !p.showRewards ? h(RewardSummary, { rewards: rewards }) : null));
  }

  function Ornament() {
    return h('div', { className: 'gr-orn', 'aria-hidden': true }, h('span', { className: 'gr-orn__gem' }));
  }

  function JournalEntry(p) {
    return h('article', { className: cx('gr-entry', p.className) },
      h('div', { className: 'gr-entry__kicker' }, p.session ? 'Session ' + p.session : null,
        p.date ? h('span', { className: 'gr-entry__date' }, p.date) : null),
      h('h2', { className: 'gr-entry__title' }, p.title),
      h('div', { className: 'gr-entry__body' }, p.children),
      p.author ? h(R.Fragment, null, h(Ornament), h('div', { className: 'gr-entry__author' }, 'Consign\u00E9 par ' + p.author)) : null);
  }

  var SCALES = {
    npc: ['Hostile', 'Inamical', 'Indiff\u00E9rent', 'Amical', 'Serviable'],
    faction: ['Ha\u00EF', 'M\u00E9fiant', 'Ignor\u00E9', 'Appr\u00E9ci\u00E9', 'V\u00E9n\u00E9r\u00E9']
  };
  var TONES = ['hostile', 'cold', 'neutral', 'warm', 'ally'];

  function Reputation(p) {
    var labels = p.labels || SCALES[p.kind || 'npc'];
    var n = labels.length;
    var v = Math.max(0, Math.min(n - 1, p.value == null ? Math.floor(n / 2) : p.value));
    var tone = TONES[Math.round(v / (n - 1) * 4)];
    var trend = p.trend === 'up' ? '\u25B2' : p.trend === 'down' ? '\u25BC' : null;
    var steps = [];
    for (var i = 0; i < n; i++) steps.push(h('span', { key: i, className: cx('gr-rep__step', i === v && 'gr-rep__step--on') }));
    return h('span', {
      className: cx('gr-rep', 'gr-rep--' + tone, p.compact && 'gr-rep--compact', p.className),
      role: 'img', 'aria-label': 'R\u00E9putation : ' + labels[v] + ' (' + (v + 1) + ' sur ' + n + ')' + (trend ? (p.trend === 'up' ? ', en hausse' : ', en baisse') : '')
    },
      h('span', { className: 'gr-rep__track', 'aria-hidden': true }, steps),
      h('span', { className: 'gr-rep__label', 'aria-hidden': true }, labels[v]),
      trend ? h('span', { className: 'gr-rep__trend', 'aria-hidden': true }, trend) : null);
  }

  function Medallion(p) {
    var words = (p.name || '?').trim().replace(/^(l['\u2019]|les |la |le |the )/i, '');
    var initial = (words || '?').charAt(0).toUpperCase();
    return h('span', { className: cx('gr-medal', 'gr-medal--' + (p.kind || 'npc'), 'gr-medal--' + (p.size || 'md')), 'aria-hidden': true },
      p.image ? h('img', { src: p.image, alt: '' }) : initial);
  }

  function ContactChip(p) {
    var kind = p.kind || 'npc';
    var tone = null;
    if (p.reputation != null) {
      var n = (p.labels || SCALES[kind]).length;
      tone = TONES[Math.round(Math.max(0, Math.min(n - 1, p.reputation)) / (n - 1) * 4)];
    }
    var label = p.reputation != null ? (p.labels || SCALES[kind])[p.reputation] : null;
    return h(p.onClick ? 'button' : 'span', {
      type: p.onClick ? 'button' : undefined, onClick: p.onClick,
      className: cx('gr-chip', p.onClick && 'gr-chip--link', p.className),
      title: label ? p.name + ' \u2014 ' + label : undefined
    },
      h(Medallion, { name: p.name, kind: kind, image: p.image, size: 'xs' }),
      h('span', { className: 'gr-chip__name' }, p.name),
      tone ? h('span', { className: cx('gr-chip__rep', 'gr-rep--' + tone) }, h('span', { className: 'gr-sr' }, ', ' + label)) : null);
  }

  function ContactCard(p) {
    var kind = p.kind || 'npc';
    var q = p.quests || {};
    var counts = [q.active ? h(Badge, { key: 'a', tone: 'active' }, q.active + ' en cours') : null,
      q.completed ? h(Badge, { key: 'c', tone: 'completed' }, q.completed + ' accomplie' + (q.completed > 1 ? 's' : '')) : null,
      q.failed ? h(Badge, { key: 'f', tone: 'failed' }, q.failed + ' \u00E9chou\u00E9e' + (q.failed > 1 ? 's' : '')) : null].filter(Boolean);
    return h(p.onClick ? 'button' : 'article', {
      type: p.onClick ? 'button' : undefined, onClick: p.onClick,
      className: cx('gr-contact', p.className)
    },
      h('div', { className: 'gr-contact__head' },
        h(Medallion, { name: p.name, kind: kind, image: p.image }),
        h('div', { className: 'gr-contact__id' },
          h('div', { className: 'gr-contact__kind' }, kind === 'faction' ? 'Faction' : 'PNJ'),
          h('h3', { className: 'gr-contact__name' }, p.name),
          p.role ? h('div', { className: 'gr-contact__role' }, p.role) : null)),
      p.reputation != null ? h(Reputation, { kind: kind, value: p.reputation, labels: p.labels, trend: p.trend }) : null,
      p.note ? h('p', { className: 'gr-contact__note' }, p.note) : null,
      counts.length ? h('div', { className: 'gr-contact__quests' }, counts) : null);
  }

  function BookmarkNav(p) {
    var items = p.items || [];
    var rail = p.variant === 'rail';
    var initial = typeof p.title === 'string' ? p.title.replace(/^(l['\u2019]|les |la |le |the )/i, '').charAt(0).normalize('NFD').charAt(0).toUpperCase() : null;
    // bookmarks lead to pages: links (it.link), aria-current on the active one; onChange is still called on click
    return h('nav', { className: cx('gr-bnav', rail && 'gr-bnav--rail', p.className), 'aria-label': p['aria-label'] || 'Navigation principale' },
      p.title ? h('div', { className: 'gr-bnav__head', title: rail && typeof p.title === 'string' ? p.title : undefined },
        !rail && p.kicker ? h('div', { className: 'gr-bnav__kicker' }, p.kicker) : null,
        rail && initial
          ? h(R.Fragment, null, h('div', { className: 'gr-bnav__mono', 'aria-hidden': true }, initial), h('span', { className: 'gr-sr' }, p.title))
          : h('div', { className: 'gr-bnav__title' }, p.title)) : null,
      h('ul', { className: 'gr-bnav__list' }, items.map(function (it, i) {
        if (it.divider) return h('li', { key: it.id || 'd' + i, className: 'gr-bnav__divider', role: 'separator' });
        var on = it.id === p.value;
        return h('li', { key: it.id, className: 'gr-bnav__item' },
          h('a', {
            href: it.link || '#', className: cx('gr-bnav__ribbon', on && 'gr-bnav__ribbon--on'),
            'aria-current': on ? 'page' : undefined,
            onClick: function () { if (p.onChange) p.onChange(it.id); }
          },
            it.icon ? h('span', { className: 'gr-bnav__icon', 'aria-hidden': true }, it.icon) : null,
            h('span', { className: 'gr-bnav__label' }, it.label),
            it.count != null ? h('span', { className: 'gr-bnav__count' }, rail ? h('span', { 'aria-hidden': true }, it.count) : it.count,
              rail ? h('span', { className: 'gr-sr' }, ', ' + it.count) : null) : null));
      })),
      p.footer && !rail ? h('div', { className: 'gr-bnav__foot' }, p.footer) : null);
  }

  function BookmarkTabs(p) {
    var items = (p.items || []).filter(function (it) { return !it.divider; }).slice(0, 5);
    return h('nav', { className: cx('gr-btabs', p.className), 'aria-label': p['aria-label'] || 'Navigation principale' },
      h('ul', { className: 'gr-btabs__list' }, items.map(function (it) {
        var on = it.id === p.value;
        return h('li', { key: it.id, className: 'gr-btabs__item' },
          h('a', {
            href: it.link || '#', className: cx('gr-btabs__tab', on && 'gr-btabs__tab--on'),
            'aria-current': on ? 'page' : undefined,
            onClick: function () { if (p.onChange) p.onChange(it.id); }
          },
            h('span', { className: 'gr-btabs__ribbon', 'aria-hidden': true },
              h('span', { className: 'gr-btabs__icon' }, it.icon || '\u25C6'),
              it.count ? h('span', { className: 'gr-btabs__dot' }) : null),
            h('span', { className: 'gr-btabs__label' }, it.label),
            it.count ? h('span', { className: 'gr-sr' }, ', ' + it.count) : null));
      })));
  }

  /* ---- Tabs (StatusFilter in Angular): filter a list by status, a single choice shown as underlined tabs.
     Semantically a radio group, not a tablist: every option filters the same list, there is no panel per tab.
     Not for page navigation — see BookmarkNav/BookmarkTabs. ---- */
  function Tabs(p) {
    var items = p.items || [];
    return h('div', { className: cx('gr-tabs', p.className), role: 'radiogroup', 'aria-label': p['aria-label'] }, items.map(function (it) {
      var on = it.id === p.value;
      return h('button', {
        key: it.id, type: 'button', role: 'radio', 'aria-checked': on,
        className: cx('gr-tabs__tab', on && 'gr-tabs__tab--on'),
        onClick: function () { if (p.onChange) p.onChange(it.id); }
      },
        h('span', { className: 'gr-tabs__label' }, it.label),
        it.count != null ? h('span', { className: 'gr-tabs__count' }, it.count) : null);
    }));
  }

  /* ---- Visibility: who at the table may see a piece of content ---- */
  function SealGlyph(p) {
    // a wax seal broken in two: GM-only
    return h('svg', { className: 'gr-vis__glyph', viewBox: '0 0 12 12', width: 12, height: 12, 'aria-hidden': true },
      h('path', { d: 'M5.2 1.1 A5 5 0 0 0 5.2 10.9 L6.2 8 L4.8 6 L6.4 3.6 Z', fill: 'currentColor' }),
      h('path', { d: 'M7.4 1.3 A5 5 0 0 1 7.4 10.7 L8.2 8.1 L6.9 6 L8.4 3.7 Z', fill: 'currentColor' }));
  }
  function PeopleGlyph() {
    return h('svg', { viewBox: '0 0 14 12', width: 14, height: 12, 'aria-hidden': true },
      h('circle', { cx: 4.5, cy: 6, r: 3.6, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
      h('circle', { cx: 9.5, cy: 6, r: 3.6, fill: 'currentColor' }));
  }
  function playerNames(players) {
    var you = players.filter(function (x) { return x.you; });
    var others = players.filter(function (x) { return !x.you; }).map(function (x) { return x.name; });
    var names = (you.length ? ['toi'] : []).concat(others);
    if (names.length > 3) names = names.slice(0, 2).concat(['+' + (names.length - 2)]);
    return names.length > 1 ? names.slice(0, -1).join(', ') + ' et ' + names[names.length - 1] : names[0] || '';
  }
  function Visibility(p) {
    var level = p.level || 'table';
    var players = p.players || [];
    if (level === 'table') return p.showPublic ? h('span', { className: cx('gr-vis', 'gr-vis--table', p.className) }, 'Toute la table') : null;
    if (level === 'gm') return h('span', { className: cx('gr-vis', 'gr-vis--gm', p.className) }, h(SealGlyph), 'Secret MJ');
    return h('span', { className: cx('gr-vis', 'gr-vis--players', p.className), title: players.map(function (x) { return x.name; }).join(', ') },
      h('span', { className: 'gr-vis__faces', 'aria-hidden': true }, players.slice(0, 3).map(function (x, i) {
        return h('span', { key: i, className: 'gr-vis__face' }, (x.name || '?').charAt(0).toUpperCase());
      })),
      h('span', null, (p.compact ? '' : 'Pour ') + playerNames(players)));
  }
  function SecretBlock(p) {
    var level = p.level || 'gm';
    return h('div', { className: cx('gr-secret', 'gr-secret--' + level, p.className), role: 'group',
      'aria-label': level === 'gm' ? 'Secret MJ' : 'Partag\u00E9 avec ' + playerNames(p.players || []) },
      h('div', { className: 'gr-secret__tab' }, h(Visibility, { level: level, players: p.players })),
      h('div', { className: 'gr-secret__body' }, p.children));
  }
  function VisibilityPicker(p) {
    var level = p.level || 'table';
    var roster = p.roster || [];
    var sel = p.players || [];
    var selIds = sel.map(function (x) { return x.id || x.name; });
    function setLevel(l) { if (p.onChange) p.onChange({ level: l, players: l === 'players' ? sel : [] }); }
    function toggle(pl) {
      var id = pl.id || pl.name, on = selIds.indexOf(id) >= 0;
      var next = on ? sel.filter(function (x) { return (x.id || x.name) !== id; }) : sel.concat([pl]);
      if (p.onChange) p.onChange({ level: next.length ? 'players' : 'players', players: next });
    }
    var opts = [
      { id: 'table', label: 'Toute la table', hint: 'Visible par tous' },
      { id: 'players', label: 'Certains joueurs', hint: 'MJ + joueurs choisis' },
      { id: 'gm', label: 'Secret MJ', hint: 'Toi seul' }
    ];
    return h('fieldset', { className: cx('gr-vpick', p.className) },
      h('legend', { className: 'gr-field__label' }, p.label || 'Visibilit\u00E9'),
      h('div', { className: 'gr-vpick__opts', role: 'radiogroup' }, opts.map(function (o) {
        var on = o.id === level;
        return h('button', { key: o.id, type: 'button', role: 'radio', 'aria-checked': on,
          className: cx('gr-vpick__opt', 'gr-vpick__opt--' + o.id, on && 'gr-vpick__opt--on'), onClick: function () { setLevel(o.id); } },
          h('span', { className: 'gr-vpick__mark', 'aria-hidden': true }, o.id === 'gm' ? h(SealGlyph) : o.id === 'players' ? h(PeopleGlyph) : '\u25CB'),
          h('span', { className: 'gr-vpick__text' }, h('span', { className: 'gr-vpick__label' }, o.label), h('span', { className: 'gr-vpick__hint' }, o.hint)));
      })),
      level === 'players' ? h('div', { className: 'gr-vpick__roster' },
        h('div', { className: cx('gr-vpick__rlabel', !sel.length && 'gr-vpick__rlabel--error'), id: 'gr-vpick-r', 'aria-live': 'polite' }, sel.length ? sel.length + ' joueur' + (sel.length > 1 ? 's' : '') + ' choisi' + (sel.length > 1 ? 's' : '') : 'Choisis au moins un joueur'),
        h('div', { className: 'gr-vpick__players', role: 'group', 'aria-labelledby': 'gr-vpick-r' }, roster.map(function (pl) {
          var on = selIds.indexOf(pl.id || pl.name) >= 0;
          return h('button', { key: pl.id || pl.name, type: 'button', 'aria-pressed': on,
            className: cx('gr-vpick__player', on && 'gr-vpick__player--on'), onClick: function () { toggle(pl); } },
            h('span', { className: 'gr-vis__face', 'aria-hidden': true }, pl.name.charAt(0).toUpperCase()),
            h('span', null, pl.name), pl.character ? h('span', { className: 'gr-vpick__char' }, pl.character) : null);
        }))) : null);
  }

  /* ---- Rewards ---- */
  var REWARD_GLYPH = { coin: '\u25CE', xp: '\u2726', item: '\u25C8', reputation: '\u25B2', other: '\u2767' };
  var REWARD_ICON = { coin: 'pieces', xp: 'xp', item: 'butin', reputation: 'faction', other: 'quete' };
  var RARITY = { common: 'Courant', uncommon: 'Peu courant', rare: 'Rare', unique: 'Unique' };
  function RewardSummary(p) {
    // foot of a QuestCard: currencies and XP as values, everything else counted
    var rs = p.rewards || [];
    var values = rs.filter(function (r) { return r.kind === 'coin' || r.kind === 'xp'; });
    var items = rs.filter(function (r) { return r.kind === 'item'; });
    var others = rs.length - values.length - items.length;
    var best = items.reduce(function (b, r) { var o = ['common', 'uncommon', 'rare', 'unique']; return o.indexOf(r.rarity) > o.indexOf(b) ? r.rarity : b; }, 'common');
    var parts = values.map(function (r) { return r.label; });
    return h('span', { className: 'gr-rsum' },
      parts.length ? h(Badge, { tone: 'reward', glyph: '\u2726' }, parts.join(' \u00B7 ')) : null,
      items.length ? h('span', { className: cx('gr-rsum__items', 'gr-rarity--' + best), title: items.map(function (r) { return r.label; }).join(', ') },
        h(Icon, { name: 'butin', size: 14 }), items.length === 1 ? '1 objet' : items.length + ' objets') : null,
      others > 0 ? h('span', { className: 'gr-rsum__more' }, '+' + others) : null);
  }
  function RewardList(p) {
    var rs = p.rewards || [];
    return h('div', { className: cx('gr-rewards', p.className) },
      p.title === false ? null : h('div', { className: 'gr-rewards__title' }, p.title || 'R\u00E9compenses'),
      h('ul', { className: 'gr-rewards__list' }, rs.map(function (r, i) {
        var restricted = r.visibility && r.visibility.level && r.visibility.level !== 'table';
        return h('li', { key: i, className: cx('gr-reward', 'gr-reward--' + (r.kind || 'other'), r.rarity && 'gr-rarity--' + r.rarity) },
          h('span', { className: 'gr-reward__glyph', 'aria-hidden': true }, h(Icon, { name: REWARD_ICON[r.kind] || 'quete', size: 16 })),
          h('span', { className: 'gr-reward__label' }, r.label,
            r.note ? h('span', { className: 'gr-reward__note' }, r.note) : null),
          r.rarity && r.rarity !== 'common' ? h('span', { className: 'gr-reward__rarity' }, RARITY[r.rarity]) : null,
          restricted ? h(Visibility, { level: r.visibility.level, players: r.visibility.players, compact: true }) : null);
      })));
  }

  /* ---- Icons: Lucide (ISC), redrawn at 1.5px stroke; see assets/Icons/LICENSE.txt ---- */
  var ICONS = {"quete":[["path",{"d":"M15 12h-5"}],["path",{"d":"M15 8h-5"}],["path",{"d":"M19 17V5a2 2 0 0 0-2-2H4"}],["path",{"d":"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"}]],"journal":[["path",{"d":"M12 5v16"}],["path",{"d":"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"}]],"session":[["path",{"d":"M8 2v3"}],["path",{"d":"M16 2v3"}],["rect",{"x":"3","y":"3","width":"18","height":"18","rx":"2"}],["path",{"d":"M3 9h18"}],["path",{"d":"M8 13h.01"}],["path",{"d":"M12 13h.01"}],["path",{"d":"M16 13h.01"}],["path",{"d":"M8 17h.01"}],["path",{"d":"M12 17h.01"}],["path",{"d":"M16 17h.01"}]],"pnj":[["circle",{"cx":"12","cy":"8","r":"5"}],["path",{"d":"M20 21a8 8 0 0 0-16 0"}]],"faction":[["path",{"d":"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}]],"joueurs":[["path",{"d":"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}],["path",{"d":"M16 3.128a4 4 0 0 1 0 7.744"}],["path",{"d":"M22 21v-2a4 4 0 0 0-3-3.87"}],["circle",{"cx":"9","cy":"7","r":"4"}]],"mj":[["path",{"d":"M18 11c-1.5 0-2.5.5-3 2"}],["path",{"d":"M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z"}],["path",{"d":"M6 11c1.5 0 2.5.5 3 2"}]],"lieu":[["path",{"d":"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"}],["circle",{"cx":"12","cy":"10","r":"3"}]],"carte":[["path",{"d":"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"}],["path",{"d":"M15 5.764v15"}],["path",{"d":"M9 3.236v15"}]],"butin":[["path",{"d":"M10.5 3 8 9l4 13 4-13-2.5-6"}],["path",{"d":"M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"}],["path",{"d":"M2 9h20"}]],"pieces":[["path",{"d":"M13.744 17.736a6 6 0 1 1-7.48-7.48"}],["path",{"d":"M15 6h1v4"}],["path",{"d":"m6.134 14.768.866-.5 2 3.464"}],["circle",{"cx":"16","cy":"8","r":"6"}]],"xp":[["path",{"d":"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{"d":"M20 2v4"}],["path",{"d":"M22 4h-4"}],["circle",{"cx":"4","cy":"20","r":"2"}]],"rumeur":[["path",{"d":"M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"}],["path",{"d":"M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"}]],"indice":[["path",{"d":"m2 21 9.6-9.6"}],["path",{"d":"m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19"}],["circle",{"cx":"15.5","cy":"7.5","r":"5.5"}]],"secret":[["path",{"d":"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"}],["path",{"d":"M14.084 14.158a3 3 0 0 1-4.242-4.242"}],["path",{"d":"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"}],["path",{"d":"m2 2 20 20"}]],"urgent":[["path",{"d":"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"}]],"danger":[["path",{"d":"m12.5 17-.5-1-.5 1h1z"}],["path",{"d":"M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"}],["circle",{"cx":"15","cy":"12","r":"1"}],["circle",{"cx":"9","cy":"12","r":"1"}]],"reglages":[["path",{"d":"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}],["circle",{"cx":"12","cy":"12","r":"3"}]],"ajouter":[["path",{"d":"M5 12h14"}],["path",{"d":"M12 5v14"}]],"rechercher":[["path",{"d":"m21 21-4.34-4.34"}],["circle",{"cx":"11","cy":"11","r":"8"}]],"filtrer":[["path",{"d":"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"}]],"plus":[["circle",{"cx":"12","cy":"12","r":"1"}],["circle",{"cx":"19","cy":"12","r":"1"}],["circle",{"cx":"5","cy":"12","r":"1"}]]};
  function Icon(p) {
    var els = ICONS[p.name];
    if (!els) return null;
    var size = p.size || 20;
    var label = p.label;
    return h('svg', { className: cx('gr-icon', p.className), width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
      stroke: 'currentColor', strokeWidth: p.strokeWidth || 1.5, strokeLinecap: 'round', strokeLinejoin: 'round',
      role: label ? 'img' : undefined, 'aria-label': label, 'aria-hidden': label ? undefined : true, focusable: 'false', 'data-icon': p.name },
      els.map(function (e, i) {
        var a = {}; for (var k in e[1]) a[k.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); })] = e[1][k];
        a.key = i; return h(e[0], a);
      }));
  }
  Icon.names = Object.keys(ICONS);

  window.Grimoire = { Button: Button, Badge: Badge, TextField: TextField, Objective: Objective, QuestCard: QuestCard, JournalEntry: JournalEntry, Ornament: Ornament, Reputation: Reputation, ContactChip: ContactChip, ContactCard: ContactCard, Medallion: Medallion, BookmarkNav: BookmarkNav, BookmarkTabs: BookmarkTabs, Tabs: Tabs, StatusFilter: Tabs, Visibility: Visibility, SecretBlock: SecretBlock, VisibilityPicker: VisibilityPicker, RewardList: RewardList, RewardSummary: RewardSummary, Icon: Icon };
})();
