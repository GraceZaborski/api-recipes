import { mergeStringifiedObjects } from '../unlayer-tools-utils';

export const getVideoToolConfig = () => {
  const staticConfig = JSON.stringify({
    name: 'custom_video',
    supportedDisplayModes: ['email'],
    label: 'Video',
    icon: 'fa-film',
    position: 4,
    options: {
      video: {
        title: 'Video',
        position: 1,
        options: {
          url: {
            label: 'Youtube URL',
            defaultValue: '',
            widget: 'text',
          },
          alt: {
            label: 'Alt text',
            defaultValue: 'Video',
            widget: 'text',
          },
        },
      },
    },
  });

  const placeholderImage =
    'https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/b3c14325-63e8-4ada-b802-13e937d7134f.png';

  const renderer = `{
    renderer: {
      Viewer: window.unlayer.createViewer({
        render: (values) => {
          const defaultImage = '<img src="${placeholderImage}" alt="Video placeholder" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;" width="480" class"fullwidth" border="0" />';
          const videoUrl = values.url;
          if (!videoUrl) return defaultImage;
          const regex = /(youtu\\\.be\\\/|youtube\\\.com\\\/(watch\\\?(.*&)?v=|(embed|v)\\\/))([^\\\?&\\"'>]+)/;
          const match = videoUrl.match(regex);
          if (match && match[5]) {
            return \`<a href="\${videoUrl}" target="_blank"><img src="https://img.youtube.com/vi/\${match[5]}/0.jpg" title="\${values.alt}" alt="\${values.alt}" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;" width="480" class"fullwidth" border="0" /></a>\`;
          }

          return defaultImage;
        },
      }),
      exporters: {
        email: (values) => {
          const defaultImage = '<img src="${placeholderImage}" alt="Video placeholder" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;" width="480" class"fullwidth" border="0" />';
          const videoUrl = values.url;
          if (!videoUrl) return defaultImage;
          const regex = /(youtu\\\.be\\\/|youtube\\\.com\\\/(watch\\\?(.*&)?v=|(embed|v)\\\/))([^\\\?&\\"'>]+)/;
          const match = videoUrl.match(regex);
          if (match && match[5]) {
            return \`<a href="\${videoUrl}" target="_blank"><img src="https://img.youtube.com/vi/\${match[5]}/0.jpg" title="\${values.alt}" alt="\${values.alt}" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;" width="480" class"fullwidth" border="0" /></a>\`;
          }

          return defaultImage;
        },
      }
    }
  }`.replace(/\n/g, '');

  const config = mergeStringifiedObjects(staticConfig, renderer);

  return config;
};
