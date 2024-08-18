import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputSearch from '../../../shared/ui/InputSearch/InputSearch.tsx';
import {
  getUsersGithubRepo,
  githubRepoActions,
} from '../../../entities/Search/model/slices/repoSlice.ts';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../app/providers/StoreProvider/config/hook.ts';
import Button, { ButtonColor, ButtonSize, ButtonTheme } from '../../../shared/ui/Button/Button.tsx';

import styles from './NavBar.module.scss';

const Navbar = () => {
  const { value, page, perPage } = useAppSelector((state) => state.repositories);
  const dispatch = useAppDispatch();

  //сам поиск когда мы что-то ищем
  const onChangeRepos = (value: string) => {
    dispatch(githubRepoActions.setValue(value));
  };

  //если поле пустое - выведем alert
  const handleCLickForSearch = () => {
    if (value === '') {
      alert('Поле поиска не может быть пустым');
      return;
    }
    dispatch(getUsersGithubRepo({ value, page, perPage }));
  };

  return (
    <AppBar position="static" className={styles.navbar}>
      <Toolbar className={styles.toolbar}>
        <div className={styles.container}>
          <InputSearch value={value} onChange={onChangeRepos} />
          <Button
            theme={ButtonTheme.CONTAINED}
            size={ButtonSize.MEDIUM}
            color={ButtonColor.PRIMARY}
            onClick={handleCLickForSearch}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
