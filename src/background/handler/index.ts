import { Background, handle } from '@src/utils/EventBus/background';
import { startVisit } from './startVisit';
import { goForwardBySender } from './goForward';

handle(Background.startVisit, startVisit);

handle(Background.goForward, (_, sender) => goForwardBySender(sender));
