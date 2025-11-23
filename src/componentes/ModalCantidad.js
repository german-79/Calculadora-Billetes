import React, { useState, useMemo } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TecladoPOS from './TecladoPOS';
import colores from '../estilos/colores';

function calcularDeExpresion(tokens) {
    return tokens.reduce((a, b) => a + b, 0);
}

export default function ModalCantidad({ visible, inicial = 0, onConfirm, onCancel }) {
    const [numeroActual, setNumeroActual] = useState(String(inicial || 0));
    const [tokens, setTokens] = useState([]);

    React.useEffect(() => {
        setNumeroActual(String(inicial || 0));
        setTokens([]);
    }, [inicial, visible]);

    const total = useMemo(() => {
        const nums = tokens.map(n => Number(n));
        const actual = numeroActual ? Number(numeroActual) : 0;
        return nums.reduce((a, b) => a + b, 0) + actual;
    }, [tokens, numeroActual]);

    const handleKey = (key) => {
        if (key === 'DEL') {
            setNumeroActual((s) => s.length > 1 ? s.slice(0, -1) : '0');
            return;
        }
        if (key === 'C') {
            setNumeroActual('0');
            setTokens([]);
            return;
        }
        if (key === '+') {
            const n = Number(numeroActual || 0);
            setTokens((t) => [...t, n]);
            setNumeroActual('0');
            return;
        }
        if (key === 'OK') {
            const final = Math.min(999, total);
            onConfirm(final);
            return;
        }

        // Ingreso de dígitos
        if (/^\d$/.test(key)) {
            setNumeroActual((s) => {
                const base = (s === '0') ? key : s + key;
                if (base.length > 3) return s;
                return base;
            });
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.backdrop}>
                <View style={styles.modal}>
                    <Text style={styles.titulo}>Ingresar cantidad</Text>

                    <View style={styles.displayWrap}>
                        <Text style={styles.tokensText}>
                            {tokens.length ? tokens.join(' + ') + ' + ' : ''}
                        </Text>

                        <Text style={styles.numeroText}>
                            {String(numeroActual || '0')}
                        </Text>

                        <Text style={styles.totalText}>
                            Total: {total}
                        </Text>
                    </View>

                    {/** 👉 SOLO el teclado POS */}
                    <TecladoPOS onKey={handleKey} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-end'
    },
    modal: {
        backgroundColor: colores.blanco,
        padding: 16,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        maxHeight: '80%'
    },
    titulo: {
        fontSize: 18,
        fontWeight: '700',
        color: colores.primario,
        marginBottom: 6
    },
    displayWrap: {
        marginBottom: 12,
        alignItems: 'flex-end'
    },
    tokensText: {
        color: '#666',
        fontSize: 14
    },
    numeroText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#111'
    },
    totalText: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: '700'
    }
});
