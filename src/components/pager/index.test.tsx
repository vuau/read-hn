import { render, screen} from 'test-utils';
import userEvent from '@testing-library/user-event'
import preview from 'jest-preview';
import Pager from './index';

const ItemRenderer = ({ data }: { data: number }) => <div>{data}</div>;

test('can load more', async () => {
  const user = userEvent.setup();
  const data = [1, 2, 3, 4];
  const pageSize = 2;
  render(<Pager<number> data={data} pageSize={pageSize} Component={ItemRenderer} />);
  expect(screen.queryByText('1')).toBeInTheDocument();
  expect(screen.queryByText('2')).toBeInTheDocument();
  expect(screen.queryByText('3')).not.toBeInTheDocument();
  expect(screen.queryByText('4')).not.toBeInTheDocument();
  expect(screen.queryByText('Load more')).toBeInTheDocument();
  await user.click(screen.getByRole('button', {name: /load more/i}))
  expect(screen.queryByText('1')).toBeInTheDocument();
  expect(screen.queryByText('2')).toBeInTheDocument();
  expect(screen.queryByText('3')).toBeInTheDocument();
  expect(screen.queryByText('4')).toBeInTheDocument();
  expect(screen.queryByText('Load more')).not.toBeInTheDocument();
  preview.debug();
})

