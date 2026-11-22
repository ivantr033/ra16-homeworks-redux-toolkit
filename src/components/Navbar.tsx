import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/uiSlice';
import type { RootState } from '../store';

export function Navbar() {
    const dispatch = useDispatch();
    const favoritesCount = useSelector((state: RootState) => state.favorites.items.length);
    const theme = useSelector((state: RootState) => state.ui.theme);

    return (
        <header className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-brand">
                    🎬 КиноПоиск <span>RTK</span>
                </NavLink>

                <nav className="navbar-links">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Поиск
                    </NavLink>

                    <NavLink
                        to="/favorites"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Избранное
                        {favoritesCount > 0 && <span className="nav-badge">{favoritesCount}</span>}
                    </NavLink>

                    <button
                        type="button"
                        className="theme-toggle-btn"
                        title={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </nav>
            </div>
        </header>
    );
}
