import { ChevronRight, Download, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useAppDispatch, useAppState } from '../store/AppContext';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORY_COLOR_PALETTE, CATEGORY_ICON_OPTIONS } from '../store/seed';
import { exportExpensesToCSV } from '../utils/csv';
import { formatMoney } from '../utils/money';
import { todayISO } from '../utils/date';

export function Settings() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingIncome, setAddingIncome] = useState(false);
  const [editingBiweekly, setEditingBiweekly] = useState(false);
  const [biweeklyDraft, setBiweeklyDraft] = useState(String(state.incomes.biweeklyAmount || ''));

  function saveBiweekly() {
    const parsed = parseFloat(biweeklyDraft.replace(',', '.')) || 0;
    dispatch({ type: 'SET_BIWEEKLY_INCOME', payload: parsed });
    setEditingBiweekly(false);
  }

  return (
    <div className="screen">
      <div className="screen-title">Ajustes</div>

      <section className="settings-section">
        <div className="section-label">Categorías</div>
        <div className="card list-card">
          {state.categories.map((cat) =>
            editingCategoryId === cat.id ? (
              <CategoryEditRow
                key={cat.id}
                categoryId={cat.id}
                initialName={cat.name}
                initialColor={cat.color}
                initialIcon={cat.icon}
                onDone={() => setEditingCategoryId(null)}
              />
            ) : (
              <button key={cat.id} type="button" className="list-row" onClick={() => setEditingCategoryId(cat.id)}>
                <div className="category-avatar" style={{ background: cat.color, borderRadius: 8 }}>
                  <CategoryIcon name={cat.icon} size={14} color="oklch(28% 0.02 250)" />
                </div>
                <div className="list-row-label">{cat.name}</div>
                <ChevronRight size={16} color="var(--text-tertiary)" />
              </button>
            )
          )}
          {addingCategory ? (
            <CategoryAddRow onDone={() => setAddingCategory(false)} />
          ) : (
            <button type="button" className="list-row list-row--action" onClick={() => setAddingCategory(true)}>
              <div className="list-row-add-icon">
                <Plus size={14} strokeWidth={2.5} color="var(--accent-blue)" />
              </div>
              <div className="list-row-label list-row-label--accent">Agregar categoría</div>
            </button>
          )}
        </div>
      </section>

      <section className="settings-section">
        <div className="section-label">Ingresos</div>
        <div className="card list-card">
          {editingBiweekly ? (
            <div className="list-row list-row--edit">
              <div className="list-row-label">Ingreso quincenal</div>
              <input
                className="inline-input"
                type="text"
                inputMode="decimal"
                autoFocus
                value={biweeklyDraft}
                onChange={(e) => setBiweeklyDraft(e.target.value)}
                onBlur={saveBiweekly}
                onKeyDown={(e) => e.key === 'Enter' && saveBiweekly()}
              />
            </div>
          ) : (
            <button type="button" className="list-row" onClick={() => setEditingBiweekly(true)}>
              <div className="list-row-label">Ingreso quincenal</div>
              <div className="list-row-value">${formatMoney(state.incomes.biweeklyAmount)} CAD</div>
              <ChevronRight size={16} color="var(--text-tertiary)" />
            </button>
          )}
          {state.incomes.extraIncomes.map((inc) => (
            <div key={inc.id} className="list-row">
              <div className="list-row-label">{inc.name}</div>
              <div className="list-row-value list-row-value--positive">+${formatMoney(inc.amount)}</div>
              <button
                type="button"
                className="icon-btn icon-btn--danger"
                onClick={() => dispatch({ type: 'DELETE_EXTRA_INCOME', payload: { id: inc.id } })}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {addingIncome ? (
            <ExtraIncomeAddRow onDone={() => setAddingIncome(false)} />
          ) : (
            <button type="button" className="list-row list-row--action" onClick={() => setAddingIncome(true)}>
              <div className="list-row-add-icon">
                <Plus size={14} strokeWidth={2.5} color="var(--accent-blue)" />
              </div>
              <div className="list-row-label list-row-label--accent">Agregar ingreso adicional</div>
            </button>
          )}
        </div>
      </section>

      <section className="settings-section">
        <div className="section-label">General</div>
        <div className="card list-card">
          <div className="list-row">
            <div className="list-row-label">Tu nombre</div>
            <input
              className="inline-input inline-input--right"
              type="text"
              value={state.settings.userName}
              onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', payload: { userName: e.target.value } })}
            />
          </div>
          <div className="list-row">
            <div className="list-row-label">Notificación diaria</div>
            <button
              type="button"
              className={`toggle ${state.settings.dailyReminder ? 'is-on' : ''}`}
              onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { dailyReminder: !state.settings.dailyReminder } })}
            >
              <div className="toggle-knob" />
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="section-label">Datos</div>
        <div className="card list-card">
          <button
            type="button"
            className="list-row"
            onClick={() => exportExpensesToCSV(state.expenses, state.categories)}
          >
            <Download size={18} color="var(--text-secondary)" />
            <div className="list-row-label">Exportar a CSV / Excel</div>
            <ChevronRight size={16} color="var(--text-tertiary)" />
          </button>
        </div>
      </section>
    </div>
  );
}

function CategoryAddRow({ onDone }: { onDone: () => void }) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLOR_PALETTE[0]);
  const [icon, setIcon] = useState(CATEGORY_ICON_OPTIONS[0]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch({ type: 'ADD_CATEGORY', payload: { name: name.trim(), color, icon } });
    onDone();
  }

  return (
    <form className="list-row list-row--edit list-row--edit-form" onSubmit={handleSubmit}>
      <input
        className="inline-input"
        type="text"
        placeholder="Nombre de la categoría"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ColorIconPicker color={color} icon={icon} onColor={setColor} onIcon={setIcon} />
      <div className="edit-form-actions">
        <button type="button" className="btn-text" onClick={onDone}>
          Cancelar
        </button>
        <button type="submit" className="btn-text btn-text--accent">
          Guardar
        </button>
      </div>
    </form>
  );
}

function CategoryEditRow({
  categoryId,
  initialName,
  initialColor,
  initialIcon,
  onDone,
}: {
  categoryId: string;
  initialName: string;
  initialColor: string;
  initialIcon: string;
  onDone: () => void;
}) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [icon, setIcon] = useState(initialIcon);

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch({ type: 'UPDATE_CATEGORY', payload: { id: categoryId, name: name.trim(), color, icon } });
    onDone();
  }

  function handleDelete() {
    if (confirm('¿Borrar esta categoría? Los gastos ya cargados no se eliminan.')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: { id: categoryId } });
      onDone();
    }
  }

  return (
    <form className="list-row list-row--edit list-row--edit-form" onSubmit={handleSave}>
      <input className="inline-input" type="text" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
      <ColorIconPicker color={color} icon={icon} onColor={setColor} onIcon={setIcon} />
      <div className="edit-form-actions">
        <button type="button" className="btn-text btn-text--danger" onClick={handleDelete}>
          Borrar
        </button>
        <button type="button" className="btn-text" onClick={onDone}>
          Cancelar
        </button>
        <button type="submit" className="btn-text btn-text--accent">
          Guardar
        </button>
      </div>
    </form>
  );
}

function ColorIconPicker({
  color,
  icon,
  onColor,
  onIcon,
}: {
  color: string;
  icon: string;
  onColor: (v: string) => void;
  onIcon: (v: string) => void;
}) {
  return (
    <div className="picker-group">
      <div className="picker-row">
        {CATEGORY_COLOR_PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            className="swatch"
            style={{ background: c, boxShadow: c === color ? '0 0 0 2px var(--accent-blue)' : 'none' }}
            onClick={() => onColor(c)}
          />
        ))}
      </div>
      <div className="picker-row">
        {CATEGORY_ICON_OPTIONS.map((iconName) => (
          <button
            key={iconName}
            type="button"
            className={`icon-swatch ${iconName === icon ? 'is-selected' : ''}`}
            onClick={() => onIcon(iconName)}
          >
            <CategoryIcon name={iconName} size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ExtraIncomeAddRow({ onDone }: { onDone: () => void }) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(',', '.'));
    if (!name.trim() || !parsed) return;
    dispatch({ type: 'ADD_EXTRA_INCOME', payload: { name: name.trim(), amount: parsed, date: todayISO() } });
    onDone();
  }

  return (
    <form className="list-row list-row--edit list-row--edit-form" onSubmit={handleSubmit}>
      <input
        className="inline-input"
        type="text"
        placeholder="Nombre (ej. Freelance)"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="inline-input"
        type="text"
        inputMode="decimal"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="edit-form-actions">
        <button type="button" className="btn-text" onClick={onDone}>
          Cancelar
        </button>
        <button type="submit" className="btn-text btn-text--accent">
          Guardar
        </button>
      </div>
    </form>
  );
}
