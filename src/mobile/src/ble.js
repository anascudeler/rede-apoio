import { useEffect, useState } from 'react';
import KeyEvent from 'react-native-keyevent';

const VOLUME_UP = 24;

export function useChaveiro(aoApertar) {
  const [ativo] = useState(true);
  useEffect(() => {
    KeyEvent.onKeyDownListener((e) => { if (e.keyCode === VOLUME_UP) aoApertar(); });
    return () => KeyEvent.removeKeyDownListener();
  }, [aoApertar]);
  // O pareamento é feito nas configurações de Bluetooth do celular.
  return { conectado: ativo, nomeDisp: 'botão pareado', conectar: () => {} };
}