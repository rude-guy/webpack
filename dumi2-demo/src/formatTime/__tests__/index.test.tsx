import formatTime from '..';

describe('formatTime', () => {
  it('正确格式化指定时间', () => {
    const timestamp = 1681216363389;
    const formattedDate = formatTime(timestamp, 'YYYY年MM月DD日 hh时mm分ss秒');
    expect(formattedDate).toEqual('2023年04月11日 20时32分43秒');
  });

  it('默认格式化指定时间', () => {
    const timestamp = 1681216363389;
    const formattedDate = formatTime(timestamp);
    expect(formattedDate).toEqual('2023-04-11 20:32:43');
  });
});
