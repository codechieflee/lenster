import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import GetModuleIcon from '@components/utils/GetModuleIcon';
import { CashIcon } from '@heroicons/react/outline';
import { getModule } from '@lib/getModule';
import { Mixpanel } from '@lib/mixpanel';
import { motion } from 'framer-motion';
import { FC, useState } from 'react';
import { useCollectModuleStore } from 'src/store/collectmodule';
import { PUBLICATION } from 'src/tracking';

import Modules from './Modules';

const SelectCollectModule: FC = () => {
  const selectedModule = useCollectModuleStore((state) => state.selectedModule);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Tooltip placement="top" content={getModule(selectedModule.moduleName).name}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => {
            setShowModal(!showModal);
            Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.OPEN_COLLECT_CONFIG);
          }}
          aria-label="Choose Collect Module"
        >
          <div className="text-brand">
            <GetModuleIcon module={selectedModule.moduleName} size={5} />
          </div>
        </motion.button>
      </Tooltip>
      <Modal
        title="Select collect module"
        icon={<CashIcon className="w-5 h-5 text-brand" />}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <Modules setShowModal={setShowModal} />
      </Modal>
    </>
  );
};

export default SelectCollectModule;
