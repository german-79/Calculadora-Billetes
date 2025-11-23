import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotonBillete from '../componentes/BotonBillete';
import ModalCantidad from '../componentes/ModalCantidad';
import denominaciones from '../utils/denominaciones';
import colores from '../estilos/colores';

const STORAGE_KEY = '@cantidades_billetes_v1';

const format = (n) => Intl.NumberFormat('es-AR').format(n);

export default function CalculadoraBilletes() {
    const [cantidades, setCantidades] = useState(denominaciones.map(() => 0));
    const [modalVisible, setModalVisible] = useState(false);
    const [indiceActivo, setIndiceActivo] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length === denominaciones.length) {
                        setCantidades(parsed);
                    }
                }
            } catch (e) {
                console.warn('Error leyendo storage', e);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cantidades));
            } catch (e) {
                console.warn('Error guardando storage', e);
            }
        })();
    }, [cantidades]);

    const abrirModal = (i) => {
        setIndiceActivo(i);
        setModalVisible(true);
    };

    const confirmarCantidad = (valor) => {
        if (indiceActivo === null) return;
        const copia = [...cantidades];
        copia[indiceActivo] = Number(valor || 0);
        setCantidades(copia);
        setModalVisible(false);
    };

    const calcularTotal = () => {
        return denominaciones.reduce((acc, den, i) => acc + den * (cantidades[i] || 0), 0);
    };

    const resetearTodo = () => {
        Alert.alert(
            'Borrar datos',
            '¿Querés borrar todas las cantidades ingresadas?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Borrar',
                    style: 'destructive',
                    onPress: async () => {
                        const zeros = denominaciones.map(() => 0);
                        setCantidades(zeros);
                        try {
                            await AsyncStorage.removeItem(STORAGE_KEY);
                        } catch (e) {
                            console.warn('Error limpiando storage', e);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.safe}>

            <View style={styles.header}>
                <Text style={styles.title}>Calculadora de Billetes</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>

                {denominaciones.map((den, i) => (
                    <BotonBillete
                        key={den}
                        denominacion={den}
                        cantidad={cantidades[i]}
                        onPress={() => abrirModal(i)}
                    />
                ))}

                {/* --- TOTAL --- */}
                <View style={styles.totalBox}>
                    <Text style={styles.totalInline}>
                        TOTAL: <Text style={styles.totalValueInline}>${format(calcularTotal())}</Text>
                    </Text>
                </View>

                {/* --- BOTÓN BORRAR --- */}
                <TouchableOpacity style={styles.resetBtn} onPress={resetearTodo}>
                    <Text style={styles.resetText}>Limpiar</Text>
                </TouchableOpacity>

            </ScrollView>

            {modalVisible && (
                <ModalCantidad
                    visible={modalVisible}
                    inicial={cantidades[indiceActivo]}
                    onConfirm={confirmarCantidad}
                    onCancel={() => setModalVisible(false)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({

    safe: {
        flex: 1,
        backgroundColor: colores.fondo,
        paddingTop: StatusBar.currentHeight || 20
    },

    header: {
        padding: 16,
        backgroundColor: colores.primario,
        alignItems: 'center',
        justifyContent: 'center'
    },

    title: {
        color: colores.blanco,
        fontSize: 20,
        fontWeight: '800'
    },

    container: {
        padding: 16,
        paddingBottom: 40
    },

    totalBox: {
        marginTop: 20,
        padding: 16,
        backgroundColor: colores.blanco,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center'
    },

    totalInline: {
        fontSize: 18,
        color: '#666',
        fontWeight: '700'
    },
    
    totalValueInline: {
        fontSize: 26,
        fontWeight: '900',
        color: colores.texto
    },

    totalLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4
    },

    totalValue: {
        fontSize: 26,
        fontWeight: '900',
        color: colores.texto
    },

    resetBtn: {
        marginTop: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EEE',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center'
    },

    resetText: {
        color: '#B00',
        fontWeight: '700',
        fontSize: 16
    }
});
