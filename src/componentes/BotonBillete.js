import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colores from '../estilos/colores';

const format = (n) => Intl.NumberFormat('es-AR').format(n);

export default function BotonBillete({ denominacion, cantidad, onPress }) {
    const subtotal = denominacion * (cantidad || 0);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            
            {/* Denominación */}
            <View style={styles.left}>
                <Text style={styles.denText}>${format(denominacion)}</Text>
            </View>

            {/* Cantidad (sin label, más finito) */}
            <View style={styles.center}>
                <Text style={styles.cantNumber}>{String(cantidad || 0).padStart(3, '0')}</Text>
            </View>

            {/* Subtotal */}
            <View style={styles.right}>
                <Text style={styles.subText}>${format(subtotal)}</Text>
            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colores.blanco,
        paddingVertical: 15,    // antes 12 → más finito
        paddingHorizontal: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        elevation: 1,
    },

    left: { flex: 4 },
    center: { flex: 2, alignItems: 'center' },
    right: { flex: 4, alignItems: 'flex-end' },

    denText: { 
        fontSize: 18, 
        fontWeight: '700', 
        color: colores.primario 
    },

    // Cantidad más sutil y sin caja
    cantNumber: { 
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        letterSpacing: 1
    },

    subText: { 
        fontSize: 16, 
        fontWeight: '700', 
        color: '#222' 
    }
});
