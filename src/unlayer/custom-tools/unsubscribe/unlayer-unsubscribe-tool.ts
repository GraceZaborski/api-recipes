import { mergeStringifiedObjects } from '../unlayer-tools-utils';
import { unlayerUnsubscribeDefaultHtml } from './unlayer-unsubscribe-html';

export const getUnsubscribeToolConfig = ({
  company,
}: {
  user?: any;
  company?: any;
}) => {
  const unsubscribeHtml: string =
    company?.settings?.campaigns?.unsubscribe?.url?.html ||
    unlayerUnsubscribeDefaultHtml;

  const staticConfig = JSON.stringify({
    name: 'unsubscribe',
    supportedDisplayModes: ['email'],
    label: 'Unsubscribe',
    // TODO: replace the data url below with the url to the image file
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIzLjExMDQgMTEuNDIxOUwyOC42ODcgMTdMMjMuMTEwNCAyMi41NzgxIiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMy44MTI1IDE3SDI4LjY4MzYiIHN0cm9rZT0iIzUxNTY1OSIgc3Ryb2tlLXdpZHRoPSIyLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEzLjgxMjUgMjguNjg3NUg2LjM3NUM2LjA5MzIxIDI4LjY4NzUgNS44MjI5NiAyOC41NzU2IDUuNjIzNyAyOC4zNzYzQzUuNDI0NDQgMjguMTc3IDUuMzEyNSAyNy45MDY4IDUuMzEyNSAyNy42MjVWNi4zNzVDNS4zMTI1IDYuMDkzMjEgNS40MjQ0NCA1LjgyMjk2IDUuNjIzNyA1LjYyMzdDNS44MjI5NiA1LjQyNDQ0IDYuMDkzMjEgNS4zMTI1IDYuMzc1IDUuMzEyNUgxMy44MTI1IiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=',
    usageLimit: 1,
  });

  const unsubscribeHtmlProcessed = unsubscribeHtml.replace(/"/g, "'");

  const renderer = `{
    values: {
      html: "${unsubscribeHtmlProcessed}",
    },
    renderer: {
      Viewer: window.unlayer.createViewer({
        render: () => "${unsubscribeHtmlProcessed}",
      }),
      exporters: {
        email: () => "${unsubscribeHtmlProcessed}",
      }
    }
  }`.replace(/\n/g, '');

  const config = mergeStringifiedObjects(staticConfig, renderer);

  return config;
};
