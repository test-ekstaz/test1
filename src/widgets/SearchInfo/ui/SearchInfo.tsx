import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel/TableSortLabel';
import Paper from '@mui/material/Paper';
import { RepoSchema } from '../../../entities/Search';
import { useAppDispatch, useAppSelector } from '../../../app/providers/StoreProvider/config/hook';
import { useEffect, useState, useRef } from 'react';
import Star from '../../../shared/icons/Star.svg';
import Loader from '../../../shared/ui/Loader/Loader';
import {
  getUsersGithubRepo,
  githubRepoActions,
} from '../../../entities/Search/model/slices/repoSlice';

import styles from './SearchInfo.module.scss';

//перечисления по каким полям мы ищем
enum SortField {
  Fork = 'fork',
  Star = 'star',
  Update = 'update',
}

const SearchInfo = () => {
  const [firtVis, setFirtVis] = useState(true);
  const { value, isLoading, repos, page, perPage } = useAppSelector((state) => state.repositories);
  const dispatch = useAppDispatch();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<SortField>(SortField.Fork);
  const [hoverData, setHoverData] = useState<RepoSchema | null>(null);
  const previousValue = useRef(value);

  //эффекст на первый рендер для отображения приветствия
  useEffect(() => {
    if (firtVis && repos.length > 0) {
      setFirtVis(false);
    }
  }, [repos.length, firtVis]);

  //эффект на изменение состояния строки поиска
  useEffect(() => {
    // Сбросить состояния, если value изменилось
    if (previousValue.current !== value) {
      setSortOrder('asc');
      setSortField(SortField.Fork);
      setHoverData(null);
      dispatch(githubRepoActions.setPage(0));
      dispatch(githubRepoActions.setPerPage(10));
      dispatch(githubRepoActions.clearData());
      setFirtVis(true);
      // Теперь текущее значение становится предыдущим
      previousValue.current = value;
    }
  }, [value, dispatch]);

  const tableTitle = [
    { id: 1, name: 'Название', field: '' },
    { id: 2, name: 'Язык', field: '' },
    { id: 3, name: 'Число форков', field: 'fork' },
    { id: 4, name: 'Число звезд', field: 'star' },
    { id: 5, name: 'Дата обновления', field: 'update' },
  ];

  const firstVisited = <div className={styles.firstVisited}>Добро пожаловать</div>;
  const resDiv = <div className={styles.result}>Результаты поиска</div>;
  const HoverVisible = ({ name, language, stargazers_count, license }: RepoSchema) => (
    <div className={styles.hoverVisible}>
      <div className={styles.name}>{name !== '-' ? name : 'Без названия'}</div>
      <div className={styles.infoWrapper}>
        <div className={styles.language}>{language ? language : 'Без языка'}</div>
        <div className={styles.star}>
          <img src={Star} alt="star" />
          <span>{stargazers_count}</span>
        </div>
      </div>
      <div className={styles.license}>{license ? license.name : 'Без лицензии'}</div>
    </div>
  );

  //функция для преобразования даты которая приходит с сервера
  function parseDate(dateStr: string): string {
    if (!dateStr || dateStr === '-') {
      return 'Invalid Date';
    }

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  //функция для смены страницы
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    event?.preventDefault();
    dispatch(githubRepoActions.clearData());
    dispatch(githubRepoActions.setPage(newPage));
    dispatch(getUsersGithubRepo({ value, page: newPage, perPage }));
  };

  //функция для смены количества элементов на странице
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(githubRepoActions.clearData());
    const newPerPage = parseInt(event.target.value);
    dispatch(githubRepoActions.setPerPage(newPerPage));
    dispatch(getUsersGithubRepo({ value, page: 0, perPage: newPerPage }));
  };

  //функция для сортировки
  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  //видимые элементы
  const getVisibleElems = () => {
    const itemsCopy = repos[0]?.items ? [...repos[0].items] : [];

    return itemsCopy?.sort((a, b) => {
      if (sortOrder === 'asc' && sortField === 'fork') {
        return a.forks! - b.forks!;
      } else if (sortOrder === 'desc' && sortField === 'fork') {
        return b.forks! - a.forks!;
      }

      if (sortOrder === 'asc' && sortField === 'star') {
        return a.stargazers_count! - b.stargazers_count!;
      } else if (sortOrder === 'desc' && sortField === 'star') {
        return b.stargazers_count! - a.stargazers_count!;
      }

      if (sortOrder === 'asc' && sortField === 'update') {
        return new Date(a.updated_at!).getTime() - new Date(b.updated_at!).getTime();
      } else if (sortOrder === 'desc' && sortField === 'update') {
        return new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime();
      }
      return 0;
    });
  };

  //когда мы нажимаем на строку для вывода в правой части информации по репозиторию
  const onHoverForRowElem = (item: RepoSchema) => {
    setHoverData(item);
  };

  const visibleElems = getVisibleElems();

  const firstVisitedHandler = repos.length === 0 && firtVis ? firstVisited : null;
  const loading = isLoading ? <Loader /> : null;
  const content =
    !firstVisitedHandler && !isLoading ? (
      <>
        {resDiv}
        <div className={styles.wrapperTable}>
          <div className={styles.left}>
            <TableContainer sx={{ boxShadow: 'none', maxHeight: '70vh' }} component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {tableTitle.map((row) =>
                      row?.id > 2 ? (
                        <TableCell className={styles.tableTitle} align="right" key={row?.id}>
                          <TableSortLabel
                            active={sortField === row?.field}
                            direction={sortOrder}
                            onClick={() => handleSortToggle(row?.field as SortField)}
                            className={styles.sortLabelReversed}>
                            {row?.name}
                          </TableSortLabel>
                        </TableCell>
                      ) : (
                        <TableCell
                          key={row?.id}
                          className={styles.tableTitle}
                          align={row?.id === 1 ? 'left' : 'right'}>
                          {row?.name}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleElems.map((row: RepoSchema) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                      }}
                      onClick={() => onHoverForRowElem(row)}
                      // onMouseLeave={() => setHoverData(null)}
                    >
                      <TableCell className={styles.rowCell} component="th" scope="row">
                        {row?.name}
                      </TableCell>
                      <TableCell className={styles.rowCell} align="right">
                        {row?.language}
                      </TableCell>
                      <TableCell className={styles.rowCell} align="right">
                        {row?.forks}
                      </TableCell>
                      <TableCell className={styles.rowCell} align="right">
                        {row?.stargazers_count}
                      </TableCell>
                      <TableCell className={styles.rowCell} align="right">
                        {parseDate(row.updated_at!)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              className={styles.pagination}
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={repos[0]?.total_count}
              rowsPerPage={perPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
          <div className={styles.right}>
            {hoverData && Object.keys(hoverData).length > 0 ? (
              <HoverVisible
                name={hoverData?.name}
                license={hoverData?.license}
                language={hoverData?.language}
                stargazers_count={hoverData?.stargazers_count}
              />
            ) : (
              <div className={styles.text}>Выберите репозитоий</div>
            )}
          </div>
        </div>
      </>
    ) : null;

  return (
    <div className="container">
      {firstVisitedHandler}
      {loading}
      {content}
    </div>
  );
};

export default SearchInfo;
